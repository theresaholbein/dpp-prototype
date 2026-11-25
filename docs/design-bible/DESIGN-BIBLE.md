---
name: "code-gaia-design-bible"
description: "This describes how design is handled within code gaia - along with a whole list of rules and guidance to follow."
---

## Purpose

This document tells Code Gaia frontend devs and others how to lay out UI without waiting for a designer. Part one covers the gestalt principles: how people group and read what they see. Part two lists our own rules for components, spacing and color, and every rule in it traces back to part one.

Each principle has four parts: what it is, when to use it, when not to, and the mistakes we see most. When a rule in part two seems arbitrary, look up the principle behind it.

## Gestalt principles

People see groups, paths and shapes before they read a label. The nine principles below describe how. The first three are the ones you will use daily.

### 1. Proximity

Close elements read as a group, distant ones as separate. Space inside a group is always smaller than space between groups.

#### When to use

- Put a label closer to its own field than to any other.
- Separate clusters and page sections with more space than you use inside them.
- Place buttons next to the content they act on.

#### When not to use

- Items are unrelated, even when space is short.
- An element needs space around it to stand out, or the layout would get too dense.

#### Common pitfalls

- A label sits halfway between two fields.
- Elements are crowded until nothing reads as a group and click targets get mis-hit.
- Spacing is picked by eye instead of from one scale.

### 2. Similarity

Elements that share color, shape, size or texture read as one group, even far apart.

#### When to use

- Style items of the same kind identically: nav links, cards, list rows, form fields.
- Show selected and active states the same way everywhere.
- Color-code statuses, but keep one pill shape and size.

#### When not to use

- Elements do different things, or one must rank higher, like the primary action.
- Unrelated items would look connected.

#### Common pitfalls

- Unrelated elements look alike, so users assume a link.
- Everything looks the same, including the primary action.
- The active state updates in one place only.

### 3. Common region

Elements inside one boundary or on one background read as a group, and this beats proximity and similarity. Use space first; add a container only when space can't do the job.

#### When to use

- One card per self-contained piece of content, in the same style for every module.
- Dividers or panels to split long forms into sections.
- Nested regions to show hierarchy, like a panel of cards.

#### When not to use

- Whitespace already groups the elements, regions would overlap, or a border would interrupt scanning.

#### Common pitfalls

- Boxes around everything.
- Regions too faint to see.
- The same kind of content in differently styled regions.

### 4. Continuity

The eye follows the smoothest line it finds, so elements on one axis read as a sequence. We read left to right and top to bottom.

#### When to use

- Align labels, fields and buttons on shared axes, in the order people fill them in.
- Show sequences as steppers or progress bars running one way.

#### When not to use

- Items are unrelated or need equal attention, like a grid of peer cards.
- The path leads away from the key action or against user expectations.

#### Common pitfalls

- One element off the axis breaks the line.
- Two paths compete for the eye.
- The flow has more turns and steps than the task needs.

### 5. Figure-ground

The eye splits every view into a figure and the ground behind it, based on contrast in color, size or depth. At Code Gaia, blue marks the figure: the path the user needs to take.

#### When to use

- Lift modals, dropdowns and tooltips with an overlay or background color, and dim the rest.
- Give interactive elements a hover state.
- Leave space around the element that needs focus.

#### When not to use

- The effect is too subtle to see.

#### Common pitfalls

- Text or controls fail WCAG contrast.
- Busy backgrounds, or figure and ground competing for focus.
- Decorative elements look clickable, or clickable ones look decorative.

### 6. Common fate

Elements that move or change together read as one group. Motion beats every static cue.

#### When to use

- Animate a dropdown and its items as one unit.
- Move multi-selected items together when they are dragged, sorted or removed.
- Update related chart points and loading states in sync.

#### When not to use

- The elements need to read as separate.
- The motion adds nothing or contradicts the hierarchy.

#### Common pitfalls

- Motion that distracts or makes users wait.
- Items in one group move with different timing or easing.
- Unrelated elements animate together.
- `prefers-reduced-motion` is ignored.

### 7. Closure

The mind fills gaps to see a complete shape, as long as enough of it is there and the shape is familiar.

#### When to use

- Outlined icons that suggest a form with few lines.
- Dashed borders for drop zones and empty placeholders.
- A last card or tab that peeks off the edge to signal more content.
- Partly filled bars or rings for progress.

#### When not to use

- Users need exact, complete information, like figures in a report.
- A form field would look unfinished or disabled.

#### Common pitfalls

- Icons too abstract to recognize.
- A critical action depends on users completing a shape in their head.
- Cut-off content with no way to reach the rest.

### 8. Symmetry and order

Balanced, aligned layouts read as one stable unit. Aim for balance, not mirror images.

#### When to use

- Build pages and forms on one shared grid.
- Keep chart axes and spacing consistent.
- Order menus and lists by a visible rule, like alphabet or frequency.

#### When not to use

- The page needs a focal point. Break the balance on purpose.
- Mirroring would put elements out of task order or force awkward sizes.

#### Common pitfalls

- Screens so even that nothing guides the eye.
- A button moved away from its content for the sake of symmetry.
- Extra wrappers added only to keep things symmetrical.

### 9. Prägnanz

The brain reads anything complex in its simplest form; every other principle is a special case of this one. Aim for the simplest layout that still tells users everything they need.

#### When to use

- Remove any element that doesn't help finish the task.
- Make the primary action the most prominent element on screen.
- Break complex data into a few plain groups.

#### When not to use

- Simplifying would hide details users need, like the numbers behind a KPI, or flatten the hierarchy.

#### Common pitfalls

- Features cut or hidden for the sake of a clean screen.
- Styling so minimal that elements can't be told apart.
- Icons without labels.

## Code Gaia rules

### A. White space

Good design shows in what it leaves blank. As the principles show, empty space carries as much meaning as content. Space that only gives the eye a rest is still worth leaving. Let it breathe.

### B. Consistency, consistency, consistency

Above all, be consistent: corner radius, border color, text sizes, padding, gaps, button types, button sizes and icon sizes. Make your own page consistent first, then match the rest of the app. Use the shared component library wherever you can.

### C. Trust your gut

Much of design can't be put into words. If you have used and built a lot of software, trust your instincts: if something feels wrong, it probably is. Iterate until it feels right.

### D. No shadows

Shadows don't fit our CI. Some components, such as input fields and panels, still use them. Don't copy that. Separate an object from its background with color and contrast instead. Borders and backgrounds of UI components need at least 3:1 contrast against the colors next to them.

### E. Layout and spacing

- Space belongs to the group, not the item. Set it with `gap` on the wrapper instead of margins on each child, such as every input owning the space above it.
- Padding belongs to the wrapper and is the same on all sides. Don't split it so the wrapper owns vertical padding and the child owns horizontal padding. AI agents like to do this.
- To make elements read as a group, put them close together or inside a card.
- We read left to right and top to bottom, so confirm buttons and next steps go bottom right.
- Use a header when you need one. On endless pages, a header keeps the elements users work with in reach.
- Spacing follows 2, 4 and 8, with 6 used less often: `p-2`, `p-4`, `p-8` and `p-6`, plus the matching `gap` classes.

### F. Hierarchy

- Rank elements by importance and give the most important ones the most visual weight. This applies to objects as much as text: a headline is the biggest text on the page, and a card header gets an icon and bigger, bolder text than the card body.
- Keep the number of steps small, so each is easy to tell apart. If everything is big, nothing stands out.
- Our software is mostly grey, so color guides the eye. Use it to mark the leading elements of the highest order. Blue categories, for example, let the eye jump from one to the next. The one primary blue button per page does the same for the most important function.
- One primary blue button per page content area. The app header and sidebar don't count. Everything else ranks below it.
- People can focus on only a handful of things at once. Keep a page's primary functions to six or fewer, so users aren't overwhelmed.

### G. Buttons and icons

- Use icon-only buttons when the icon is unmistakable, or the function is niche enough not to need a text button. Text buttons take more space. Every icon-only button gets a tooltip.
- Use an icon only when it carries information or supports the visual pattern. Twelve identical icons stacked in a column add nothing.
- Every focusable element, or its clickable container, is at least 24 × 24 px. An icon can be smaller as long as the button around it meets the minimum.

### H. Lists and tables

- In long lists, give each item one lead element, usually the name. Make it slightly bigger, or set it apart by color or font weight, so the eye has something to orient on.
- Use a table when items have many attributes to compare side by side. Otherwise, such as a task list, use cards.
- Don't repeat yourself. If the same label shows up on 12 elements, rework the layout so it appears once, for example as a column header.
- We build mostly for desktop, so we can rely on hover. Hide secondary and especially niche functions and info texts that would clutter the view, and reveal them as a button or icon button on hover and keyboard focus. Never hide key actions.
- Row actions go at the very end of a table, in their own column. Make that column sticky if the table scrolls sideways and the actions would otherwise disappear.
- Table headers can be sticky, but don't have to be.
- Build tables as flexible as their use. An overview with many columns that people work in for hours should let them hide columns, and maybe resize them.

### I. Interactions

- Look for small touches that make an interaction pleasant. For example, give a button a tooltip when its function takes a moment to learn.
- Don't break the user's flow. Pick the lightest container that fits the task:
    1. A small panel that opens like a dropdown, for simple actions that need no special attention.
    2. A dialog, for jumping quickly between many items or functions, as in task management.
    3. Its own page, for a lot of information worked on for a long time.
- The exception: break the flow on purpose before users do something with serious consequences, such as deleting data for good. Users don't read text, so a warning on the page isn't enough. Use a confirmation dialog that states exactly what will happen, not just "are you sure?". Offer undo wherever the system allows it. Don't confirm routine actions, or users learn to click through confirmations without reading.
- Every interactive element is reachable by keyboard, including elements that only appear on hover. Our linter enforces most of this.

### J. States

- Design the empty state and the missing-permission state for every page and component.
- While content loads, show a loading indicator or a skeleton.
- Show general errors as a toast. Show specific errors, such as a wrong or missing form input, in an inline error box at the exact place where the problem is.

### K. Text

- Every rule in this bible applies to text too, both to how it looks and to what it says. Be consistent, clear and precise. Use as few words as you can and as many as you need.
- Tell types of text apart by size, font weight and color only. No underlines, italics or other styling.
- Design and build for strings longer than the one in front of you. Every text element needs a defined overflow, wrap and truncation behavior.
- Never scale text down to make it fit.
- When text is truncated, show the full text in a tooltip on hover, or let it wrap onto a new line instead.
- Use sentence case. Never set labels or anything else in all caps. AI agents like to do this.

### L. Components

Work down this ladder and stop at the first rung that holds:

1. Does it need to exist at all? If the need is speculative, skip it.
2. Does Volt or our own codebase already have it? Use it. Pass a prop instead of forking a component to change one thing.
3. Can an installed dependency do it? Extend it instead of hand-rolling a replacement or adding a new dependency.
4. Only then, build the minimum that works.