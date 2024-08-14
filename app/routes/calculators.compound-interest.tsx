import React from 'react';
import CompoundInterestChart from "../components/compoundInterestChart";
import { useNavigation } from '@remix-run/react';


export default function Compound() {
    const navigation = useNavigation();

    if (navigation.state === 'loading') {
        return <div>Loading...</div>;
      }

    return (
        <div className="flex flex-col w-full">
            <div className="flex-grow items-center justify-center">
            <CompoundInterestChart />
            </div>
        </div>
    )

}