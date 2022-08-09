import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../layout/Header'
import { Breadcrumb, Layout, Menu } from 'antd';

const Admin: NextPage = () => {
  return (
    <Layout style={{minHeight: '100vh',}}>
        <Header />
    </Layout>
  )
}

export default Admin
