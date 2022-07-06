import React from 'react'
import ReactDOM from 'react-dom'

import styles from './Tooltip.module.scss'

import { ITooltipProps, TooltipOffsetType, TooltipPositionType } from './model'

const OFFSET_FROM_CHILDREN = 15

const defaultChildrenDOMRect: DOMRect = {
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => null,
}

/**
 * Function use to calculate tooltip offset
 *
 * @param {tooltipPosition: TooltipPositionType} tooltipPosition
 *
 * @param {currentChildrenDOMRect: DOMRect} currentChildrenDOMRect
 *
 * @returns {TooltipOffsetType | null} tooltip offset
 */
const getTooltipOffset = (
    tooltipPosition: TooltipPositionType,
    currentChildrenDOMRect: DOMRect,
): TooltipOffsetType | null => {
    switch (tooltipPosition) {
        case 'Top':
            return {
                top: currentChildrenDOMRect.top + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width / 2 + window.pageXOffset,
            }
        case 'Bottom':
            return {
                top: currentChildrenDOMRect.bottom + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width / 2 + window.pageXOffset,
            }
        case 'Left':
            return {
                top: currentChildrenDOMRect.top + currentChildrenDOMRect.height / 2 + window.pageYOffset,
                left: currentChildrenDOMRect.left + window.pageXOffset,
            }
        case 'Right':
            return {
                top: currentChildrenDOMRect.top + currentChildrenDOMRect.height / 2 + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width + window.pageXOffset,
            }
        case 'TopLeft':
        case 'LeftTop':
            return {
                top: currentChildrenDOMRect.top + window.pageYOffset,
                left: currentChildrenDOMRect.left + window.pageXOffset,
            }
        case 'TopRight':
        case 'RightTop':
            return {
                top: currentChildrenDOMRect.top + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width + window.pageXOffset,
            }
        case 'BottomLeft':
            return {
                top: currentChildrenDOMRect.top + currentChildrenDOMRect.height + window.pageYOffset,
                left: currentChildrenDOMRect.left + window.pageXOffset,
            }
        case 'BottomRight':
            return {
                top: currentChildrenDOMRect.top + currentChildrenDOMRect.height + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width + window.pageXOffset,
            }
        case 'LeftBottom':
            return {
                top: currentChildrenDOMRect.bottom + window.pageYOffset,
                left: currentChildrenDOMRect.left + window.pageXOffset,
            }
        case 'RightBottom':
            return {
                top: currentChildrenDOMRect.bottom + window.pageYOffset,
                left: currentChildrenDOMRect.left + currentChildrenDOMRect.width + window.pageXOffset,
            }
        default:
            return null
    }
}

/**
 * Function returns new position for the tooltip if the tooltip goes beyond the boundaries of the screen
 *
 * @param {tooltipPosition: TooltipPositionType} tooltipPosition
 *
 * @param {tooltipRefCurrent: HTMLDivElement} tooltipRefCurrent
 *
 * @param {tooltipOffset: TooltipOffsetType} tooltipOffset
 *
 * @param {childrenDOMRect: DOMRect} childrenDOMRect
 *
 * @returns {TooltipPositionType | null} new tooltip position
 */
const checkTooltipBoundaries = (
    tooltipPosition: TooltipPositionType,
    tooltipRefCurrent: HTMLDivElement,
    tooltipOffset: TooltipOffsetType,
    childrenDOMRect: DOMRect,
): TooltipPositionType | null => {
    if (
        (tooltipPosition === 'Top' || tooltipPosition === 'TopRight' || tooltipPosition === 'TopLeft') &&
        childrenDOMRect.top - tooltipRefCurrent.clientHeight - OFFSET_FROM_CHILDREN <= 0
    ) {
        return 'Bottom'
    }

    if (
        (tooltipPosition === 'Bottom' || tooltipPosition === 'BottomRight' || tooltipPosition === 'BottomLeft') &&
        childrenDOMRect.bottom + tooltipRefCurrent.clientHeight > window.innerHeight
    ) {
        return 'Top'
    }

    if (
        (tooltipPosition === 'Top' || tooltipPosition === 'TopLeft') &&
        tooltipOffset.left + Math.floor(tooltipRefCurrent.clientWidth / 2) > window.innerWidth
    ) {
        return 'Left'
    }

    if (
        (tooltipPosition === 'Top' || tooltipPosition === 'TopRight') &&
        tooltipOffset.left < Math.floor(tooltipRefCurrent.clientWidth / 2)
    ) {
        return 'Right'
    }

    return null
}

/**
 * Function returns tooltip postion relative to the screen
 *
 * @param {tooltipPosition: TooltipPositionType} tooltipPosition
 *
 * @param {tooltipRefCurrent: HTMLDivElement} tooltipRefCurrent
 *
 * @param {tooltipOffset: TooltipOffsetType} tooltipOffset
 *
 * @returns {{top: string; left: string; transform: string;}} tooltip position
 */
const calculateTooltipPosition = (
    tooltipPosition: TooltipPositionType,
    tooltipRefCurrent: HTMLDivElement,
    tooltipOffset: TooltipOffsetType,
): { top: string; left: string; transform: string } | null => {
    if (tooltipPosition === 'Top') {
        return {
            top: `${tooltipOffset.top - tooltipRefCurrent.clientHeight}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(-50%, -${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'Bottom') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(-50%, ${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'Left') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left - tooltipRefCurrent.clientWidth}px`,
            transform: `translate(-${OFFSET_FROM_CHILDREN}px, -50%) scale(1)`,
        }
    } else if (tooltipPosition === 'Right') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(${OFFSET_FROM_CHILDREN}px, -50%) scale(1)`,
        }
    } else if (tooltipPosition === 'TopLeft') {
        return {
            top: `${tooltipOffset.top - tooltipRefCurrent.clientHeight}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(0, -${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'TopRight') {
        return {
            top: `${tooltipOffset.top - tooltipRefCurrent.clientHeight}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(-100%, -${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'BottomLeft') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(0, ${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'BottomRight') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(-100%, ${OFFSET_FROM_CHILDREN}px) scale(1)`,
        }
    } else if (tooltipPosition === 'LeftTop') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left - tooltipRefCurrent.clientWidth}px`,
            transform: `translate(-${OFFSET_FROM_CHILDREN}px, 0) scale(1)`,
        }
    } else if (tooltipPosition === 'LeftBottom') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left - tooltipRefCurrent.clientWidth}px`,
            transform: `translate(-${OFFSET_FROM_CHILDREN}px, -100%) scale(1)`,
        }
    } else if (tooltipPosition === 'RightTop') {
        return {
            left: `${tooltipOffset.left}px`,
            top: `${tooltipOffset.top}px`,
            transform: `translate(${OFFSET_FROM_CHILDREN}px, 0) scale(1)`,
        }
    } else if (tooltipPosition === 'RightBottom') {
        return {
            top: `${tooltipOffset.top}px`,
            left: `${tooltipOffset.left}px`,
            transform: `translate(${OFFSET_FROM_CHILDREN}px, -100%) scale(1)`,
        }
    }

    return null
}

const Tooltip: React.FC<ITooltipProps> = ({
    type,
    children,
    position,
    content,
    animationDuration = 200,
    trigger = 'Hover',
    isAutomaticPositionDetectionDisabled = false,
}) => {
    const [tooltipPosition, setTooltipPosition] = React.useState<TooltipPositionType>(position)
    const [tooltipOffset, setTooltipOffset] = React.useState<TooltipOffsetType>({
        top: 0,
        left: 0,
    })
    const [childrenDOMRect, setChildrenDOMRect] = React.useState<DOMRect>(defaultChildrenDOMRect)
    const [isVisible, setVisible] = React.useState(false)

    const tooltipRef = React.useRef<HTMLDivElement | null>(null)
    const rootElement: HTMLElement | null = document.getElementById('root')

    React.useEffect(() => {
        const tooltipRefCurrent = tooltipRef.current

        if (tooltipRefCurrent) {
            tooltipRefCurrent.style.transitionDuration = `${animationDuration}ms`

            const newTooltipPosition: TooltipPositionType | null = !isAutomaticPositionDetectionDisabled
                ? checkTooltipBoundaries(tooltipPosition, tooltipRefCurrent, tooltipOffset, childrenDOMRect)
                : null

            if (newTooltipPosition) {
                handleSetTooltipOffset(newTooltipPosition, childrenDOMRect)
            } else {
                const tooltipRefPosition = calculateTooltipPosition(tooltipPosition, tooltipRefCurrent, tooltipOffset)

                if (tooltipRefPosition) {
                    tooltipRefCurrent.style.top = tooltipRefPosition.top
                    tooltipRefCurrent.style.left = tooltipRefPosition.left
                    tooltipRefCurrent.style.transform = tooltipRefPosition.transform
                    tooltipRefCurrent.style.opacity = '1'
                }
            }
        }
    }, [tooltipOffset])

    const handleSetTooltipOffset = React.useCallback(
        (tooltipPosition: TooltipPositionType, currentChildrenDOMRect: DOMRect) => {
            setChildrenDOMRect(currentChildrenDOMRect)
            setTooltipPosition(tooltipPosition)

            const currentTooltipOffset = getTooltipOffset(tooltipPosition, currentChildrenDOMRect)

            if (currentTooltipOffset) {
                setTooltipOffset(currentTooltipOffset)
                setVisible(true)
            }
        },
        [],
    )

    const handleChildrenTrigger = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const currentChildrenDOMRect = event.currentTarget.getBoundingClientRect()

        handleSetTooltipOffset(tooltipPosition, currentChildrenDOMRect)
    }

    const handleChildrenMouseLeave = () => {
        setVisible(false)
    }

    return (
        <React.Fragment>
            {isVisible && rootElement
                ? ReactDOM.createPortal(
                      <div className={styles[`tooltip${type}_${tooltipPosition}`]} ref={tooltipRef}>
                          {content}
                      </div>,
                      rootElement,
                  )
                : null}

            <div
                className={styles.children}
                onMouseOver={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    trigger === 'Hover' && handleChildrenTrigger(event)
                }
                onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                    trigger === 'Click' && handleChildrenTrigger(event)
                }
                onMouseLeave={handleChildrenMouseLeave}
            >
                {children}
            </div>
        </React.Fragment>
    )
}

export default Tooltip
