/**
 * Inline style for every panel `AnimatePresence` shows over the page: the
 * dropdown list, the tooltip, the dialog and its backdrop, the popover, the
 * toast.
 *
 * `will-change: transform` gives the panel a compositor layer of its own for
 * its whole life, not only while its enter and leave transitions run, so a
 * repaint of live figures or a chart under the panel never re-rasters the
 * panel with it.
 *
 * The panels enter and leave through CSS transitions on purpose: a
 * script-driven compositor animation that is cancelled once it finishes left
 * the panel to drop out for one frame later, whenever the page idled, in
 * Brave 1.95 on macOS and Linux (nolus-protocol/webapp#617, bisected on a probe
 * page: the same panel with a CSS transition never did).
 */
export const presenceLayerStyle = { willChange: "transform" } as const;
