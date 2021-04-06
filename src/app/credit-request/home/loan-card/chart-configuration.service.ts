
import { LoansModuleLoan } from '../../models/loansModuleLoan';
import { RoundOneThousandPipe } from '~/app/shared/pipes';
import localize from 'nativescript-localize';
import { AppColors } from '~/app/shared/constants';
import { isValidColor } from '~/app/shared/utils/utils';
import { ChartConfiguration } from '~/app/shared/models';

export class ConfigureChart {
    constructor(private roundOneThousand: RoundOneThousandPipe) {}

    public getConfig(input: LoansModuleLoan): string {
        const isCurrentIndex = input.payments.indexOf(input.payments.find(payment => payment.isCurrent));
        return JSON.stringify(<ChartConfiguration>{
            chart: {
                style: {
                    fontFamily: 'sans-serif'
                },
                panning: true,
                pinchType: 'x',
                resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                },
                height: 200
            },
            title: {
                text: ''
            },
            xAxis: {
                min: 2,
                max: input.payments.length - 1,
                categories: input.payments.map(payment => payment.monthChartName),
                lineColor: 'white',
                labels: {
                    style: {
                        color: '#1B3F74'
                    },
                    y: 30
                },
                offset: 10,
                plotBands: [
                    {
                        color: '#D6D9E080',
                        from: isCurrentIndex - 0.5,
                        to: isCurrentIndex + 0.5
                    }
                ]
            },
            yAxis: {
                tickPositions: [
                    0,
                    this.roundOneThousand.transform(Math.round(input.totalAmount / 2)),
                    this.roundOneThousand.transform(input.totalAmount)
                ],
                min: 0,
                max: input.totalAmount,
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
                followTouchMove: false
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
                    data: input.payments
                        .map(payment =>
                            this.roundOneThousand.transform(
                                payment.paymentDueAmountRollingTotal +
                                    payment.paidToPaymentDueAmountRollingTotalDifference
                            )
                        )
                        .filter(amount => amount),
                    color: isValidColor(input.color) ? input.color : AppColors.Green
                },
                {
                    type: 'line',
                    data: input.payments.map(payment =>
                        this.roundOneThousand.transform(payment.paymentDueAmountRollingTotal)
                    ),
                    color: '#D6D9E0',
                    dashStyle: 'ShortDash',
                    enableMouseTracking: false,
                    marker: {
                        enabled: false
                    }
                }
            ]
        });
    }

    private addAlpha(color: string): string {
        const _opacity = Math.round(Math.min(Math.max(0.3 || 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }
}
