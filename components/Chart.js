import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet,Image, Dimensions } from 'react-native'
import { ChartDot, ChartPath, ChartPathProvider, ChartYLabel } from '@rainbow-me/animated-charts'
import { useSharedValue } from 'react-native-reanimated'

export const {width: SIZE} = Dimensions.get('window')

const Chart = ({ currentPrice, logoUrl, name, priceChangePercentage7d, sparkline, symbol }) => {

    const latestCurrentPrice = useSharedValue(currentPrice)
    const [chartReady, setChartReady] = useState(false)

    const priceChangeColor = priceChangePercentage7d > 0 ? '#34C759' : '#ff3830'

    useEffect(() => {
        latestCurrentPrice.value = currentPrice

        setTimeout(() => {
            setChartReady(true)
        }, 0)
    }, [currentPrice])

    const formatUSD = value => {
        'worklet'
        if(value === '') {
            return `$${latestCurrentPrice.value.toLocaleString('en-US', { currency: 'USD' })}`
        }

        const formattedValue =`$${parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`

        return formattedValue
    }

    return (
        <ChartPathProvider data={{ points: sparkline, smoothingStrategy: 'bezier' }}>
            <View style={styles.chartWrapper}>
                <View style={styles.titlesWrapper}>
                    <View style={styles.upperTtile}>
                        <View style={styles.upperLeftTitle}>
                            <Image source={{ uri: logoUrl }} style={styles.image} />
                            <Text style={styles.subtitle}>{name} ({symbol.toUpperCase()})</Text>
                        </View>
                        <Text style={styles.subtitle}>7d</Text>
                    </View>
                    <View style={styles.lowerTitle}>
                        <ChartYLabel
                            format={formatUSD}
                            style={styles.title}
                        />
                        {/* <Text style={styles.title}>${currentPrice.toLocaleString('en-US', { currency: 'USD' })}</Text> */}
                        <Text style={styles.subtitle, {color: priceChangeColor }}>{priceChangePercentage7d.toFixed(2)}%</Text>
                    </View>
                </View>
            { chartReady ? 
            (<View style={styles.chartLineWrapper}>
                <ChartPath height={SIZE / 2} stroke="black" width={SIZE} />
                <ChartDot style={{ backgroundColor: 'black' }} />
            </View>)

                : 

                null
            }

            </View>
        </ChartPathProvider>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        color: '#000',
        fontWeight: 'bold'
    },
    subtitle: {
        marginTop: 4,
        fontSize: 14,
        color: '#a9abb1'
    },
    chartWrapper: {
        marginVertical: 16
    },
    titlesWrapper: {
        marginHorizontal: 16
    },
    upperTtile: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    image: {
        width: 24,
        height: 24,
        marginRight: 4
    },  
    upperLeftTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    lowerTitle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chartLineWrapper: {
        marginTop: 40
    }, 
})

export default Chart
