export default async function sitemap() {
    const routearray = ['https://testnix.vercel.app', 'https://testnix.vercel.app/contact', 'https://testnix.vercel.app/refund', 'https://testnix.vercel.app/privacy', 'https://testnix.vercel.app/terms', 'https://testnix.vercel.app/pricing']

    const routes = routearray.map((prod) => ({
        url: `${prod}`,
        lastModified: new Date().toISOString(),
    }));


    return [...routes];
}