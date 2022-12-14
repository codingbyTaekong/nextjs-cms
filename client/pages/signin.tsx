import type { NextPage } from "next";
import Head from "next/head";
import { Layout, Button, Checkbox, Form, Input } from "antd";
import axios from "../api/axios";
import { useRouter } from 'next/router'
import styled from "styled-components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import {setUserInfo, ActionSetUserInfo} from '../redux/UserInfo'
import useLogin from "../hooks/useLogin";

const Container = styled.div`
    width: 50%;
    height: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.2);
    & > form {
        width: 80%;
    }
    @media (max-width : 600px) {
        width: 95%;
        height: 80%;
    }
`;


const Signin: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const SetUserInfo = ({user_id, user_nickname, rule, access_token} :ActionSetUserInfo) => dispatch(setUserInfo({user_id, user_nickname, rule, access_token }));
    const [validateStatus, setValidateStatus ]= useState({
        id : {
            stat : true,
            help : ""
        },
        password : {
            stat : true,
            help : ""
        }
    });
    const onFinish = (values: any) => {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
          id : values.id,
          password : values.password
      }).then(res=> {
        // 비밀번호가 틀렸을 때
        if (res.data.callback === 403) {
            setValidateStatus({
                ...validateStatus,
                password : {
                    stat : false,
                    help : "잘못된 비밀번호입니다."
                }
            })
        }
        // 아이디가 틀렸을 때
        if (res.data.callback === 404) {
            setValidateStatus({
                ...validateStatus,
                id : {
                    stat : false,
                    help : "존재하지 않는 아이디입니다."
                }
            })
        }
        // 로그인 처리
        if (res.data.callback === 200) {
            const {accessToken, refreshToken} = res.data.token;
            const {id, nickname, rule} = res.data.user
            axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
            SetUserInfo({
                user_id : id,
                user_nickname : nickname,
                rule,
                access_token : accessToken,
            })
            router.push('/')
        }
      }).catch(err=> {
          console.log(err)
      })
    };
    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };
    // useEffect(()=> {
    //     axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`).then(res=> {
    //         // 로그인 처리
    //         if (res.data.callback === 200) {
    //             console.log(res.data)
    //             const {accessToken, refreshToken} = res.data.token;
    //             const {id, nickname, rule} = res.data.user
    //             axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    //             SetUserInfo({
    //                 user_id : id,
    //                 user_nickname : nickname,
    //                 rule,
    //                 access_token : accessToken,
    //                 refreshToken : refreshToken
    //             })
    //             router.push('/')
    //         }
    //     })
    // }, [])
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <Layout>
                <Container>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="아이디"
                            name="id"
                            validateStatus={validateStatus.id.stat ? "success" : "error"}
                            help={validateStatus.id.help}
                            rules={[
                                {
                                    required: true,
                                    message: "사용하실 아이디를 입력해주세요!",
                                },
                                ({getFieldValue})=> ({
                                    async validator(_, value) {
                                       try {
                                           if (!validateStatus.id.stat) {
                                            setValidateStatus({
                                                ...validateStatus,
                                                id : {
                                                    stat : true,
                                                    help : ''
                                                }
                                            })
                                                return Promise.resolve();
                                           }
                                       } catch (error) {
                                           
                                       }
               
                                   }
                               })
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="비밀번호"
                            name="password"
                            validateStatus={validateStatus.password.stat ? "success" : "error"}
                            help={validateStatus.password.help}
                            rules={[
                                {
                                    required: true,
                                    message: "비밀번호를 입력해주세요!",
                                },
                                ({getFieldValue})=> ({
                                    async validator(_, value) {
                                       try {
                                           if (!validateStatus.password.stat) {
                                            setValidateStatus({
                                                ...validateStatus,
                                                password : {
                                                    stat : true,
                                                    help : ''
                                                }
                                            })
                                                return Promise.resolve();
                                           }
                                       } catch (error) {
                                           
                                       }
               
                                   }
                               })
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 11,
                                span: 0,
                            }}

                        >
                            <Button type="primary" htmlType="submit">
                                로그인
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link href='/signup'>회원가입</Link>
                </Container>
            </Layout>
        </>
    )
}

export default Signin;