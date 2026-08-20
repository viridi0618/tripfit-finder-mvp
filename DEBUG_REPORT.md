# WhereAtlas 推荐漏斗诊断报告 (DEBUG_REPORT.md)

## 1. 现象复现与核心诊断结论

**测试用例**：
* 用户意图：从英国出发（London / `LON`），持英国护照（United Kingdom / `GB`），寻找东京（Tokyo / `TYO`）旅行推荐。
* 实际结果：在推荐结果列表中无论如何翻页均无法看到 Tokyo（东京），返回的全是欧洲城市（如 Lisbon, Barcelona, Rome, Prague, Budapest 等）。

**诊断结论**：
东京（Tokyo）无法被推荐并非单一原因，而是由 **三层递进的过滤断点（Data → Logic → UI）** 共同导致：
1. **核心根因（数据缺失）**：`app/lib/data.ts` 的 `flightCache` 数据集中，`LON` 出发地仅配置了 10 条欧洲航线价格缓存，**完全缺少 `["LON", "TYO"]`（伦敦到东京）的机票价格缓存**。
2. **算法拦截（硬过滤淘汰机制）**：`recommendTrips()` 在推荐排序时，当具有完整机票价格估算（`complete`）的目的地数量 $\ge 3$ 时，算法直接截断并返回 `complete` 列表，**100% 丢弃所有未缓存机票的目的地（`incomplete`）**。
3. **前端交互断点（别名搜索缺失）**：在护照选择器 `PassportCombobox` 中，用户输入 `"UK"` 无法模糊匹配到 `"United Kingdom"`（国家代码为 `GB`），导致用户可能留在默认护照（`india`）。

---

## 2. 详细数据流跟踪 (Data Flow Analysis)

### 阶段一：用户输入与前端解析
| 字段 | 前端输入值 | 实际解析结果 | 异常与说明 |
| :--- | :--- | :--- | :--- |
| **Passport** | 用户输入 `"UK"` | 匹配结果：`[]`（空列表） | `searchPassports("UK")` 仅支持全名与 `countryCode`（`GB`），输入 `"UK"` 无法选中英国，极易导致停留在默认值 `india`。 |
| **Passport (规范后)** | `"united-kingdom"` | `id: "united-kingdom"`, `countryCode: "GB"` | 规范化后能正确匹配到英国护照。 |
| **Departure / Origin** | `"London"` / `"LON"` | `Origin: { iata: "LON", name: "London", country: "United Kingdom" }` | 成功匹配支持的出发地 `LON`。 |
| **Budget** | `$1,500` (或默认 `$800`) | `budget = 1500` | 数值正常传递。 |
| **Duration** | `5` days | `days = 5` | 数值正常传递。 |
| **Preference** | `"Surprise me"` | `"Surprise me"` | 正常传递。 |

---

### 阶段二：推荐函数接收到的参数
```typescript
recommendTrips({
  passport: "united-kingdom", // 或用户未能修改时的 "india"
  origin: {
    iata: "LON",
    name: "London",
    city: "London",
    country: "United Kingdom",
    countryCode: "GB",
    latitude: 51.5072,
    longitude: -0.1276,
    enabled: true
  },
  budget: 1500,
  days: 5,
  preference: "Surprise me",
  offset: 0
});
```

---

### 阶段三：Tokyo 在推荐算法中的逐层计算

#### 1. 行程天数初筛 (`destinations.filter`)
* Tokyo 配置：`recommendedTripDays: [5, 9]`
* 过滤规则：`days >= Math.max(2, minDays - 2) && days <= maxDays + 4` $\rightarrow$ `5 >= 3 && 5 <= 13`
* **结果**：**通过**（Tokyo 成功进入候选池 `candidates`）。

#### 2. 单目的地估算 (`estimateTrip`)
* **签证规则检索** (`findVisaRule`):
  * `passportCountry = "GB"`, `destinationCountryCode = "JP"` $\rightarrow$ 结果为 `status: "visa_free"`（免签）。
* **机票价格缓存检索** (`getCachedFlight("LON", "TYO")`):
  * 检查 `flightCache`：
    ```typescript
    // app/lib/data.ts 中仅包含 LON 出发的以下航线：
    ["LON", "LIS", 95, 180],
    ["LON", "BCN", 85, 170],
    ["LON", "ROM", 110, 210],
    ["LON", "ATH", 135, 260],
    ["LON", "IST", 150, 280],
    ["LON", "RAK", 120, 240],
    ["LON", "BUD", 80, 160],
    ["LON", "PRG", 75, 155],
    ["LON", "BER", 85, 165],
    ["LON", "AMS", 80, 150]
    // 缺少 ["LON", "TYO", ...]
    ```
  * `getCachedFlight("LON", "TYO")` 返回 **`null`**。
* **总费用计算 (`total`)**:
  * 因为 `flight === null`，`total = { low: null, high: null }`。
  * `hasCompleteEstimate = false`。
  * `matchScore = null`。

#### 3. 候选池划分与截断逻辑 (`recommendTrips`)
```typescript
const complete = candidates.filter(r => r.hasCompleteEstimate); // 包含 10 个欧洲目的地
const incomplete = candidates.filter(r => !r.hasCompleteEstimate); // 包含 Tokyo 等

const windowSize = 5;
if (complete.length >= 3) {
  // 因为 complete.length === 10 (>= 3)，直接执行此处：
  return [...complete.slice(start), ...complete.slice(0, start)].slice(0, windowSize);
  // 【关键断点】：incomplete 列表中的所有目的地被 100% 舍弃，完全不参与返回！
}
```

---

### 阶段四：最终返回的 Destinations

当从 London（`LON`）出发时，返回的始终是以下具有完整机票缓存的欧洲目的地：
1. **Prague (PRG)**
2. **Budapest (BUD)**
3. **Lisbon (LIS)**
4. **Barcelona (BCN)**
5. **Berlin (BER)**
（点击 Show Me More 时滚动至 Amsterdam, Rome, Marrakesh, Athens, Istanbul）

**Tokyo 绝无可能出现在推荐结果中**。

---

## 3. 影响范围与受影响文件

1. `app/lib/data.ts`:
   * `flightCache` / `baseFlightCacheRows`：缺少跨大洲主要航线缓存（如 `LON -> TYO`, `NYC -> TYO` 等）。
2. `app/lib/recommendations.ts`:
   * `recommendTrips`：候选池划分策略对无机票缓存城市采取“一刀切”过滤，导致冷启动或长途热门城市无法呈现。
3. `app/components/TripFinder.tsx`:
   * `searchPassports`：缺少国家常见缩写/别名字典（如 `UK` $\rightarrow$ `United Kingdom` / `GB`, `USA` / `US` $\rightarrow$ `United States`）。
