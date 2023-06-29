import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StyleSheet, View, Dimensions, Button, Text, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SVGRenderer, SkiaChart, SvgChart } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';

// register extensions
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  SVGRenderer,
  LegendComponent,
  DataZoomComponent,
  // ...
  BarChart,
  LineChart,
]);

const E_HEIGHT = (Dimensions.get('screen').height)*0.80;
const E_WIDTH = Dimensions.get('screen').width;

function SkiaComponent({ option }) {
    const skiaRef = useRef(null);

    useEffect(() => {
        let chart;
        if (skiaRef.current) {
            // @ts-ignore
            chart = echarts.init(skiaRef.current, 'light', {
                renderer: 'svg',
                width: E_WIDTH,
                height: E_HEIGHT,
            });
            chart.setOption(option);
        }
        return () => chart?.dispose();
    }, [option]);

  return <SkiaChart ref={skiaRef}/>;
}

function SvgComponent({ option }) {

  const svgRef = useRef(null);

  useEffect(() => {
    let chart;
    if (svgRef.current) {
      // @ts-ignore
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        width: E_WIDTH,
        height: E_HEIGHT,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [option]);

  return (
    <SvgChart ref={svgRef} useRNGH={false}/>
    );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
  },
  content: {
    zIndex: 0,
  },
  reset_zoom_button_container: {
    position: 'absolute', 
    top: 70, 
    right: 50, 
    width: 80, 
    height: 30, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
    borderColor: '#DADADA',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5
  },
  reset_zoom_button: {
    fontSize: 12,
    color: 'black'
  }
});

const BarAndLineChartPOC = () => {

    let barData = [];
    let lineData = [];

    let seconsAxisLineData = [];

    let xAxisData = [];
    for (let i=0; i<25; i++) {
        let xData = '';
        let hour = i+13;
        if(hour > 23) {
            hour = hour - 24;
        }
        if(hour == 0) {
            xData = '12:00\na.m.';
        } else if (hour < 12) {
            xData = (hour).toString() + ':00\na.m.';
        } else if (hour == 12) {
            xData = '12:00\np.m.';
        } else {
            xData = (hour-12).toString() + ':00\np.m.'
        }
        xAxisData.push(xData);
        barData.push( (-1)*((i+1)-13)**2 + 14**2 - 20 );
        seconsAxisLineData.push( ( ((i+1)-12)/2 )**2 + 10);
        lineData.push( (((i+1)-12)/6 )**3 + 25) ;
    }

    const MAX_VALUE_BARDATA = (Math.ceil(Math.max( ...barData )/10) * 10);
    const MAX_VALUE_LINEDATA = (Math.ceil(Math.max( ...lineData )/10) * 10);
    const MAX_VALUE_SEC_LINEDATA = (Math.ceil(Math.max( ...seconsAxisLineData )/10) * 10);

    const [ showTooltip, setShowTooltip ] = useState(true);
    const [ resetZoom, setResetZoom ] = useState(false);

    const [option, setOption] = useState(
        {
            xAxis: {
                name: 'Hour',
                nameLocation: 'middle',
                nameGap: 36,
                nameTextStyle: {
                    fontWeight: 'bold',
                },
                type: 'category',
                data: xAxisData,
                offset: 3,
                axisTick: {
                    show: false,
                    alignWithLabel: true,
                },
                axisLabel: {
                    interval: 5,
                    fontWeight: 'bold',
                    color: '#000000'
                },
                axisLine: {
                    lineStyle: {
                        color: '#000000',
                        width: 2,
                    }
                },
                z: 3,
                splitLine: {
                    show: true,
                    interval: (index, value) => {return (index-1) % 6 === 0},
                },
            },
            yAxis: 
                [
                    {
                        type: 'value',
                        name: 'CO\u2082 (Millions)',
                        nameTextStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        },
                        nameLocation: 'center',
                        nameGap: 23,
                        position: 'left',
                        alignTicks: true,
                        axisLine: {
                          show: true,
                          lineStyle: {
                            color: '#000000',
                            width: 2
                          }
                        },
                        axisLabel: {
                            fontWeight: 'bold'
                        }
                    },
                    {
                        type: 'value',
                        name: 'SO\u2082, NO\u2093 (Thousands)',
                        nameTextStyle: {
                            fontWeight: 'bold',
                            fontSize: 14
                        },
                        nameLocation: 'center',
                        nameGap: 23,
                        nameRotate: 270,
                        position: 'right',
                        alignTicks: true,
                        axisLine: {
                            show: true,
                            lineStyle: {
                              color: '#000000',
                              width: 2
                            }
                          },
                          axisLabel: {
                              fontWeight: 'bold'
                          }
                    }
            ],
            dataZoom: [
                {
                  type: 'inside',
                  start: 0
                }
            ],
            series: 
            [
                {
                    name: 'Carbon Dioxide',
                    data: barData,
                    type: 'bar',
                    barGap: 0,
                    itemStyle: {
                        color: '#D4D4D4'
                    },
                    yAxisIndex: 0
                },
                {
                    name: 'Sulphur Dioxide',
                    data: lineData,
                    type: 'line',  
                    yAxisIndex: 1,
                    itemStyle: {
                        color: '#E6C36E'
                    },
                    showSymbol: false,
                    smooth: false
                },
                {
                    name: 'Nitrogen Oxides',
                    data: seconsAxisLineData,
                    type: 'line',
                    itemStyle: {
                        color: '#507DAB'
                    },
                    yAxisIndex: 1,
                    showSymbol: false,
                    smooth: false,
                }
            ],
            legend: {
                data: ['Carbon Dioxide', 'Sulphur Dioxide', 'Nitrogen Oxides'],
                orient: 'horizontal',
                bottom: -5,
                icon: 'rect',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 15,
                textStyle: {
                    fontWeight: 'bold',
                }
            },
            tooltip: {
                show: showTooltip,
                trigger: 'axis',
                borderWidth: 1,
                borderColor: '#C4C4C4',
                backgroundColor: '#F7F7F7',
                padding: 10,
                textStyle: {
                    fontWeight: 'bold',
                    lineHeight: 1,
                },
                formatter: function (params, ticket, callback) {
                    let title = 'At ' + params[0]["axisValueLabel"].replace('\n', ' ');
                    let carDioSentence = params[0].marker + (Math.round(params[0]["value"] * 10) / 10).toFixed(1) + 'M';
                    let sulDioSentence = params[1].marker + (Math.round(params[1]["value"] * 10) / 10).toFixed(1) + 'K';
                    let nitDioSentence = params[2].marker + (Math.round(params[2]["value"] * 10) / 10).toFixed(1) + 'K';

                    return title + '\n' + carDioSentence + '\n' + sulDioSentence + '\n' + nitDioSentence;
                },
                position: (point, params, dom, rect, size) => {
                    if (params.length === 0 ) {
                        return null;
                    }
                    setShowTooltip( true );
                    let max_value_division = params[0]["value"] > params[1]["value"] ? (params[0]["value"] > params[2]["value"] ? params[0]["value"]/MAX_VALUE_BARDATA: params[2]["value"]/MAX_VALUE_SEC_LINEDATA): params[1]["value"] > params[2]["value"] ? params[1]["value"]/MAX_VALUE_LINEDATA: params[2]["value"]/MAX_VALUE_SEC_LINEDATA;
                    let yPoint = (size.viewSize[1]*0.85) - (max_value_division)*(size.viewSize[1]*0.8) - size.contentSize[1]*0.8;
                    if (yPoint < size.contentSize[1]*0.8/2) {
                        yPoint = size.contentSize[1]*0.8/2;
                    }
                    return [ point[0] - size.contentSize[0]/2, yPoint ];
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
            }
        }
    );

    useEffect( () => {
        if( resetZoom ) {
            setOption( {
                ...option,
                dataZoom: [
                    {
                      type: 'inside',
                      start: 0
                    }
                ],
            } );
            setResetZoom(false);
        }
    }, [resetZoom] );

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                {/* <SkiaComponent option={option} style={styles.content} /> */}
                <SvgComponent option={option} style={styles.content} />
                <Pressable 
                    style={styles.reset_zoom_button_container} 
                    onPress={ () => {
                        setResetZoom(true);
                    } }
                >
                    <Text style={styles.reset_zoom_button}>Reset Zoom</Text>
                </Pressable>
            </View>
        </GestureHandlerRootView>
      );
}

export { BarAndLineChartPOC };
