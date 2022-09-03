import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../layout/Header'
import { Breadcrumb, Layout, Menu } from 'antd';
import { useCallback, useState } from 'react';
import NoticeBoard from '../../layout/NoticeBoard';

const Admin: NextPage = () => {
  const [page, setPage] = useState('notice_board');
  /**
   * Gnb 핸들러
   */
  const onChangeMenu = useCallback((e : any)=> {
    setPage(e.key);
  }, [])
  return (
    <Layout style={{minHeight: '100vh',}}>
        <Header onChange={onChangeMenu} />
        {page === "notice_board" && <NoticeBoard />}
    </Layout>
  )
}

export default Admin
