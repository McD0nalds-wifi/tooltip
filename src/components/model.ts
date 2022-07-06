export type TooltipType = 'Default' | 'Popup'

export type TooltipPositionType =
    | 'Top'
    | 'Bottom'
    | 'Left'
    | 'Right'
    | 'TopLeft'
    | 'TopRight'
    | 'BottomLeft'
    | 'BottomRight'
    | 'LeftTop'
    | 'LeftBottom'
    | 'RightTop'
    | 'RightBottom'

export type TooltipTriggerType = 'Click' | 'Hover'

export interface ITooltipProps {
    type: TooltipType
    children: React.ReactNode
    content: React.ReactNode
    position: TooltipPositionType
    animationDuration?: number
    trigger?: TooltipTriggerType
    isAutomaticPositionDetectionDisabled?: boolean
}
export type TooltipOffsetType = {
    top: number
    left: number
}
