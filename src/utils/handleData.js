import { defaultData } from "../config";

export const loadData = async () => {
    const data = await fetch(
            `${process.env.PUBLIC_URL}/geojson/${defaultData}`
        ).then((r) => r.json())

    const mergedData = {
        ...data,
        features: data.features.map((feature) => {
            return {
                ...feature,
                properties: feature.properties
            }
        })
    }

    return mergedData
};
