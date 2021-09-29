import React from 'react'
import BodyTable from '../components/list-planing/BodyTable'
import ButtonTop from '../components/list-planing/ButtonTop'
import Layout from '../layouts/Layout'

const listPlaning = () => {
    return (
        <Layout>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                    <ButtonTop/>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12">
                    <BodyTable />
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default listPlaning;
