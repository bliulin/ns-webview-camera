import { RoundOneThousandPipe } from '~/app/shared/pipes';
import localize from 'nativescript-localize';
import { AppColors } from '~/app/shared/constants';
import { isValidColor } from '~/app/shared/utils/utils';
import { ChartConfiguration } from '~/app/shared/models';
import { ChartViewModel } from '..';

export class ConfigureChart {
    constructor(private roundOneThousand: RoundOneThousandPipe) {}

    public getConfig(input: ChartViewModel): string {
        const maxAmount = Math.max(...input.transactions.map(i => i.balance));
        return JSON.stringify(<ChartConfiguration>{
            chart: {
                style: {
                    fontFamily: 'sans-serif'
                },
                height: 200
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: input.transactions.map(transaction => transaction.monthChartName),
                lineColor: 'white',
                labels: {
                    style: {
                        color: '#1B3F74'
                    },
                    y: 30
                },
                offset: 10
            },
            yAxis: {
                tickPositions: [
                    0,
                    this.roundOneThousand.transform(Math.round(maxAmount / 2)),
                    this.roundOneThousand.transform(maxAmount)
                ],
                min: 0,
                max: maxAmount,
                gridLineDashStyle: 'longdash',
                gridLineWidth: 1,
                title: {
                    enabled: false
                },
                labels: {
                    align: 'left',
                    x: 0,
                    y: 15,
                    format: '{value}k',
                    style: {
                        color: '#D6D9E0',
                        fontSize: 12
                    }
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: false,
                followTouchMove: true
            },
            plotOptions: {
                series: {
                    step: 'left'
                },
                areaspline: {
                    fillColor: {
                        linearGradient: [0, 0, 0, 300],
                        stops: [
                            [
                                0,
                                isValidColor(input.color) ? this.addAlpha(input.color) : this.addAlpha(AppColors.Green)
                            ],
                            [0.6, 'rgb(255, 255, 255, 0)']
                        ]
                    },
                    lineWidth: 2,
                    marker: {
                        enabled: false,
                        states: {
                            selected: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            legend: false,
            series: [
                {
                    type: 'areaspline',
                    name: localize('CreditRequest.Homepage.LoanCard.TooltipInfo'),
                    data: input.transactions
                        .map(transaction =>
                            this.roundOneThousand.transform(
                                transaction.balance
                            )
                        ),
                    color: isValidColor(input.color) ? input.color : AppColors.Green
                }
            ]
        });
    }

    private addAlpha(color: string): string {
        const _opacity = Math.round(Math.min(Math.max(0.3 || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }
}
