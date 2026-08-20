# 日期交互与潜在重定向诊断报告 (FLIGHT_DATE_PICKER_DEBUG.md)

## 1. 核心诊断与结论 (Root Cause Analysis)

经过对全站代码库（所有 `.tsx`、表单组件、事件绑定及路由调用）的深度排查：

### 现状结论：
1. **代码库内不存在原生/第三方日历选择器 (Date Picker)**：
   * 目前产品原型设计中，用户输入行程长度使用的是 **数字步进输入框**（`<input type="number" value={days} />`，`min="2"`，`max="21"`），并未包含具体日历日期选择器（如 `departureDate` / `returnDate`）。
2. **表单内所有交互按钮均已显式配置 `type="button"`**：
   * `TripFinder.tsx` 中涉及的所有弹出菜单项、位置获取按钮、备选出发地按钮均显式声明了 `type="button"`。
   * 唯一一个 `type="submit"` 的按钮是主提交按钮 `<button className="primary-button" type="submit">`，且 `form` 绑定了 `event.preventDefault()`，不会触发原生 GET/POST 刷新或重定向。
3. **点击推荐卡片或外跳时的行为**：
   * 结果卡片点击跳转至 `/destinations/[id]?passport=...&from=...&budget=...&days=...`（内部路由导航）。
   * 商业外跳 CTA（`AffiliateClickLink`）为 `<a href="..." target="_blank" rel="noopener noreferrer">`，点击时通过 `window.gtag` 发送分析事件并在新标签页打开 Trip.com 官方链接。

### 用户遇到“意外重定向/刷新”的可能场景场景还原：
如果用户在交互中遇到了“点击选择器或输入框时页面发生重定向/回到顶部”，根因通常为以下之一：
1. **Combobox 选项点击触发了未阻止的 Form Submit 或链接冒泡**：若在某个嵌套结构中缺少 `type="button"`（目前 `PassportCombobox` 和 `DepartureCombobox` 已经加上 `type="button"`）。
2. **移动端/键盘回车触发表单 Submit**：在 `input` 聚焦状态下按 Enter 键，会触发 `form.onSubmit`，执行 `resultRef.current?.scrollIntoView`，在视觉上表现为页面向下平滑滚动/跳跃。
3. **锚点链接跳转**：页面中存在 `<a href="/#generator">`，如果用户点击此类链接，URL 会附加 `#generator` 并重置滚动位置。

---

## 2. 涉及的相关文件 (Affected Files)

| 文件路径 | 涉及功能 | 现状评估 |
| :--- | :--- | :--- |
| `app/components/TripFinder.tsx` | 核心表单与推荐交互 | 表单提交与下拉选项按钮状态良好，均有 `type="button"` 与 `preventDefault`。 |
| `app/destinations/[id]/page.tsx` | 目的地落地页 | 存在 `<a href="/#generator">` 返回主表单的锚点链接。 |
| `app/components/AffiliateClickLink.tsx` | 商业外跳链接 | 使用标准外链与 GA4 异步非阻塞事件，安全。 |

---

## 3. 最小化改进建议 (Minimal Fix Proposal)

*(注：按规范要求，本阶段保持诊断，不直接改动代码，待确认后实施)*

1. **如未来引入 Flight Date Picker 组件**：
   * 必须确保日历组件内部的前后月份切换按钮、日期格子按钮均带上 `type="button"`，防止在 `<form>` 内被解析为 submit 按钮。
2. **防止输入框回车意外触发 Submit 刷新**：
   * 可以在 `form` 或 `input` 级别增加 `onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault(); }}` 控制。
3. **锚点平滑过渡**：
   * 确保从目的地详情页点击 `/#generator` 返回时，状态保持或平滑过渡。
