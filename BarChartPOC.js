import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SVGRenderer, SkiaChart, SvgChart } from '@wuba/react-native-echarts';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';

import axios from 'axios';

// register extensions
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  SVGRenderer,
  LegendComponent,
  // ...
  BarChart,
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

  return <SkiaChart ref={skiaRef} />;
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

  return <SvgChart ref={svgRef} useRNGH />;
}

const labelOption = {
    show: true,
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {}
    }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    margin: 'auto',
  },
});

const BarChartPOC = () => {

    let actualData = [120, 200, 150];
    let relData = [20, 105, 90];

    const [option, setOption] = useState(
        {
            tooltip: {
                trigger: 'item',
              },
            legend: {
                data: ['Actual', 'Reliability Requirement'],
                orient: 'horizontal',
                top: 'bottom',
                icon: 'rect',
                itemWidth: 10,
                itemHeight: 10,
                itemGap: 15,
                textStyle: {
                    fontWeight: 'bold',
                }
              },
          xAxis: {
            type: 'category',
            data: ['Sinchronized\nReserves', 'Primary\nReserves', '30-Minute\nReserves'],
            nameTextStyle: {
                color: '#A8A9AB',
                lineHeight: 10,
            },
            offset: 3,
            axisTick: {
                show: false,
                alignWithLabel: true,
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
                show: true,
            },
            axisTick: {
                show: true,
                onZero: false,
            },
            splitLine: {
                show: false
            },
            // splitNumber: 3,
            interval: 2000,
          },
          series: [
            {
                name: 'Actual',
                data: actualData,
                type: 'bar',
                stack: 'Actual',
                barGap: 0,
                itemStyle: {
                    color: '#689D41'
                }
            },
            {
                name: 'Reliability Requirement',
                data: relData,
                type: 'bar',
                stack: 'Reliability Requirement',
                barGap: 0,
                itemStyle: {
                    color: '#EBECEE',
                    borderWidth: 1,
                    borderType: 'solid',
                    borderColor: '#689D41',
                }
              },
          ],
        }
    );

    useEffect( () => {
        axios.get('https://pjmmobile.com:8090/mobile_app_frontend/reserves').then(
            (response) => {
                const res = response.data;
                actualData = [
                    res.dto.operational.data[0].types.ACTUAL.values.SYNCHRONIZED_RESERVES.value,
                    res.dto.operational.data[0].types.ACTUAL.values.PRIMARY_RESERVES.value,
                    10000
                ];
                relData = [
                    res.dto.operational.data[0].types.RELIABILITY_REQUIREMENT.values.SYNCHRONIZED_RESERVES.value,
                    res.dto.operational.data[0].types.RELIABILITY_REQUIREMENT.values.PRIMARY_RESERVES.value,
                    4000
                ];
                setOption(
                    {
                        ...option,
                        series: [
                            {
                                ...option.series[0],
                                data: actualData,
                            },
                            {
                                ...option.series[1],
                                data: relData,
                            },
                        ],
                    }
                );
            }
        );
    }, [] );

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <SkiaComponent option={option} style={styles.content} />
                {/* <SvgComponent option={option} style={styles.content} /> */}
            </View>
        </GestureHandlerRootView>
      );
}

export { BarChartPOC };