export default async function sitemap() {
    const routearray = ['https://testnix.live', 'https://testnix.live/contact', 'https://testnix.live/refund', 'https://testnix.live/privacy', 'https://testnix.live/terms', 'https://testnix.live/pricing']

    const routes = routearray.map((prod) => ({
        url: `${prod}`,
        lastModified: new Date().toISOString(),
    }));


    return [...routes];
}