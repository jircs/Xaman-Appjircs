import StyleService from '@services/StyleService';

import { AppFonts, AppSizes } from '@theme';
/* Styles ==================================================================== */
export default StyleService.create({
    currencyItem: {
        width: AppSizes.screen.width,
        flexDirection: 'row',
        backgroundColor: '$background',
        paddingHorizontal: AppSizes.paddingList,
    },
    currencyLabel: {
        fontSize: AppFonts.subtext.size,
        fontFamily: AppFonts.base.familyBold,
        color: '$textPrimary',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginRight: 10,
        marginBottom: 3,
    },
    issuerLabel: {
        fontSize: AppFonts.subtext.size * 0.9,
        fontFamily: AppFonts.base.family,
        color: '$grey',
    },
    balanceContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    tokenAvatarContainer: {
        marginRight: 10,
    },
    tokenIconContainer: {
        paddingRight: 5,
    },
    reorderButtonContainer: {
        flexDirection: 'row',
    },
    reorderButton: {
        marginRight: 5,
        paddingHorizontal: 20,
    },
    iconFavoriteContainer: {
        padding: 3,
        borderRadius: 15,
        backgroundColor: '$orange',
    },
    iconFavorite: {
        tintColor: '$white',
    },
});
