import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../../layout/Header'
import { Breadcrumb, Layout, Menu } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import NoticeBoard from '../../layout/NoticeBoard';
import { getCookie } from '../../middleware/Cookie';

const Admin: NextPage = () => {
  const [page, setPage] = useState('notice_board');
  
  /**
   * Gnb 핸들러
   */
  const onChangeMenu = useCallback((e : any)=> {
    setPage(e.key);
  }, [])

  const styles = {
    height: 'calc(var(--vh, 1vh) * 100)',
    backgroundColor : "#fff"
  }

  useEffect(()=> {
    const cookie = getCookie('refreshToken');
  },[])
  return (
    <Layout style={styles}>
        <Header onChange={onChangeMenu} />
        {page === "notice_board" && <NoticeBoard />}
    </Layout>
  )
}

export default Admin
