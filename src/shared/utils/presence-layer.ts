/**
 * Inline style for every panel `AnimatePresence` shows over the page: the
 * dropdown list, the tooltip, the dialog and its backdrop, the popover, the
 * toast.
 *
 * `will-change: transform` gives the panel a compositor layer of its own for
 * its whole life, not only while motion-v animates it in or out. Without it
 * the browser may fold the panel into the layer of the content beneath, so a
 * repaint of live figures or a chart under the panel re-rasters the panel as
 * well; Brave on macOS showed such panels missing for single frames while the
 * page beneath them ticked (nolus-protocol/webapp#617).
 */
export const presenceLayerStyle = { willChange: "transform" } as const;
