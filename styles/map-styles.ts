import { StyleSheet } from 'react-native'

export const mapStyles = StyleSheet.create({
    mapContainer: {
        height: '30%',
        width: '95%',
        marginLeft: '2.5%',
        marginRight: '2.5%',
    },
    mapListItem: {
        backgroundColor: '#ffe3e3',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
    },
    mapListItemName: {
        fontSize: 19,
        color: 'black',
        fontWeight: 'bold',
    },
    mapListItemRating: {
        fontSize: 18,
        color: 'blue',
    },
})