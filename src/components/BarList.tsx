import React from 'react';

interface Props {
    name: string,
    value: number,
}

const BarList = ({ data }: { data: Props[] }) => {

    const maxValue = data.reduce((max, item) => (item.value > max ? item.value : max), 0);

    function barValue(val: number) {
        return `${(val / maxValue) * 100}%`;
    }

    return (
        <>
            {/* {data.sort((a, b) => b.value - a.value).map((d, index) => (
                <div key={index} className="flex my-2 w-full flex-row justify-between items-center">
                    <div style={{
                        width: barValue(d.value),
                        borderRadius: "4px",
                    }} className={`bg-[#4589e2]`}>
                        <p className="p-1 text-start px-3.5">{d.name}</p>
                    </div>
                    <p className="mx-2 text-right min-w-min">{d.value}</p>
                </div>
            ))} */}
            <div className="flex my-2 w-full flex-row justify-center items-center">
                <div className='flex my-2 w-full flex-col'>
                    {data.sort((a, b) => b.value - a.value).map((d, index) => (
                        <div key={index} className="r">
                            <div style={{
                                width: barValue(d.value),
                                borderRadius: "4px",
                            }} className={`bg-[#4589e2]`}>
                                <p className="p-1 text-start px-3.5">{d.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='flex flex-col min-w-fit'>
                    {data.sort((a, b) => b.value - a.value).map((d, index) => (
                        <p className="mx-2 text-right">{d.value}</p>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BarList;