export interface Style {
    fontFamily: string;
    color?: string;
    fontSize?: number;
}

export interface Theme {
    display: string;
}

export interface ResetZoomButton {
    theme: Theme;
}

export interface Chart {
    style: Style;
    panning: boolean;
    pinchType: string;
    resetZoomButton: ResetZoomButton;
    height: number;
}

export interface Title {
    text: string;
}

export interface Label {
    style: Style;
    y: number;
}

export interface PlotBand {
    color: string;
    from: number;
    to: number;
}

export interface XAxis {
    min: number;
    max: number;
    categories: string[];
    lineColor: string;
    labels: Label;
    offset: number;
    plotBands: PlotBand[];
}

export interface Title {
    enabled: boolean;
}

export interface Label {
    align: string;
    x: number;
    y: number;
    format: string;
    style: Style;
}

export interface YAxis {
    tickPositions: number[];
    min: number;
    max: number;
    gridLineDashStyle: string;
    gridLineWidth: number;
    title: Title;
    labels: Label;
}

export interface Credits {
    enabled: boolean;
}

export interface Tooltip {
    enabled: boolean;
    followTouchMove: boolean;
}

export interface Sery {
    step: string;
}

export interface FillColor {
    linearGradient: number[];
    stops: any[][];
}

export interface Selected {
    enabled: boolean;
}

export interface State {
    selected: Selected;
}

export interface Marker {
    enabled: boolean;
    states: State;
}

export interface Area {
    fillColor: FillColor;
    lineWidth: number;
    marker: Marker;
}

export interface PlotOption {
    series: Sery;
    areaspline: Area;
}

export interface Sery {
    type: string;
    name: string;
    data: number[];
    color: string;
}

export interface ChartConfiguration {
    chart: Chart;
    title: Title;
    xAxis: XAxis;
    yAxis: YAxis;
    credits: Credits;
    tooltip: Tooltip;
    plotOptions: PlotOption;
    legend: boolean;
    series: Sery[];
}
