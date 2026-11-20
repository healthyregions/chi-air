import {useTranslation} from "react-i18next";

// This component handles and formats the map tooltip info.
// The props passed to this component should contain an object of the hovered object (from deck, info.object by default)
const MapTooltipContent = ({content, showCustom = false}) => {
    const { t, i18n } = useTranslation('map');
    const {
        geoid,
        acs_population,
        trees_n,
        trees_crown_den,
        heatisl,
        // nn_q3_pm2_5,
        logtraf,
        svi_pecentile,
        asthma_age_adj_rate,
        urban_flood_suscep,
        ndvi,
        simpson,
        // topline_median,
        proportionA,
        proportionB,
        proportionC,
        proportionD,
        pct_asian,
        pct_black,
        pct_hisp,
        pct_nativeam,
        pct_other,
        pct_pacis,
        pct_white,
        percentage_seniors,
        percentage_children,
        CUSTOM_INDEX_scaled,
    } = content;

    return (
        <>
            <h2>{t('tractTooltip.title', { geoid })}</h2>
            {content && <div style={{overflowY:'scroll', height:'250px'}}><span><table>
                <tbody>

                    <tr><td>{t('tractTooltip.population')}</td><td> {acs_population && acs_population.toLocaleString(i18n.resolvedLanguage)}</td></tr>
                    <tr><td>{t('tractTooltip.numberOfTrees')}</td><td> {trees_n && trees_n.toLocaleString(i18n.resolvedLanguage)}</td></tr>
                    <tr><td>{t('tractTooltip.percentCanopyCover')}</td><td> {trees_crown_den && trees_crown_den.toFixed(2)}%</td></tr>
                    <tr><td>{t('tractTooltip.surfaceTempPercentile')}</td><td> {heatisl && heatisl.toFixed(2)}</td></tr>
                    {/*<tr><td>PM2.5 Weekly Median</td><td> {topline_median && topline_median.toFixed(2)}</td></tr>*/}
                    {/*<tr><td>PM2.5 in Summer (Model Average)</td><td> {nn_q3_pm2_5 && nn_q3_pm2_5.toFixed(2)}</td></tr>*/}
                    <tr><td>{t('tractTooltip.urbanFloodSusceptibility')}</td><td> {urban_flood_suscep && urban_flood_suscep.toFixed(2)}</td></tr>
                    <tr><td>{t('tractTooltip.loggedTrafficVolume')}</td><td> {logtraf && logtraf.toFixed(2)}</td></tr>
                    <tr><td>{t('tractTooltip.socialVulnerabilityIndex')}</td><td> {svi_pecentile && svi_pecentile.toFixed(2)}</td></tr>
                    <tr><td>{t('tractTooltip.childhoodAsthmaRate')}</td><td> {asthma_age_adj_rate && asthma_age_adj_rate}</td></tr>
                    <tr><td>{t('tractTooltip.urbanFloodSusceptibility')}</td><td> {urban_flood_suscep && urban_flood_suscep.toFixed(2)}</td></tr>
                    <tr><td>{t('tractTooltip.vegetationIndex')}</td><td> {ndvi && ndvi.toFixed(3)}</td></tr>
                    <tr><td>{t('tractTooltip.plantBiodiversity')}</td><td>{simpson && simpson.toFixed(2)}</td></tr>
                    <tr><td>{t('tractTooltip.percentHolcGradeA')}</td><td> {proportionA && proportionA.toFixed(2)*100}%</td></tr>
                    <tr><td>{t('tractTooltip.percentHolcGradeB')}</td><td> {proportionB && proportionB.toFixed(2)*100}%</td></tr>
                    <tr><td>{t('tractTooltip.percentHolcGradeC')}</td><td> {proportionC && proportionC.toFixed(2)*100}%</td></tr>
                    <tr><td>{t('tractTooltip.percentHolcGradeD')}</td><td> {proportionD && proportionD.toFixed(2)*100}%</td></tr>
                    <tr><td>{t('tractTooltip.percentSeniors')}</td><td>{percentage_seniors && percentage_seniors.toFixed(2)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentChildren')}</td><td>{percentage_children && percentage_children.toFixed(2)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentAsian')}</td><td>{pct_asian && pct_asian.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentBlack')}</td><td>{pct_black && pct_black.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentNativeAmerican')}</td><td>{pct_nativeam && pct_nativeam.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentPacificIslander')}</td><td>{pct_pacis && pct_pacis.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentWhite')}</td><td>{pct_white && pct_white.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentOtherRaces')}</td><td>{pct_other && pct_other.toFixed(1)}%</td></tr>
                    <tr><td>{t('tractTooltip.percentHispanic')}</td><td>{pct_hisp && pct_hisp.toFixed(1)}%</td></tr>
                    {showCustom && <tr><td>{t('tractTooltip.customIndex')}</td><td>{CUSTOM_INDEX_scaled && CUSTOM_INDEX_scaled.toFixed(3)}</td></tr>}
                </tbody>
            </table>
            </span></div>}
        </>
    )
}

export default MapTooltipContent
