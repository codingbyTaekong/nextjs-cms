import type { NextPage } from "next";
import Head from "next/head";
import { Layout, Button, Checkbox, Form, Input } from "antd";
import styled from "styled-components";
import axios from "../api/axios";
import { useRouter } from 'next/router'
import {setUserInfo, ActionSetUserInfo} from '../redux/UserInfo'
// import axios from "axios";

import { getCookie, setCookie } from "../middleware/Cookie";
import { useSelector, useDispatch } from "react-redux";

const Container = styled.div`
    width: 50%;
    height: 50%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
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

const Signup: NextPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const SetUserInfo = ({user_id, user_nickname, rule, access_token} :ActionSetUserInfo) => dispatch(setUserInfo({user_id, user_nickname, rule, access_token}));
    const onFinish = (values: any) => {
        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
            id: values.id,
            nickname: values.nickname,
            password: values.password
        }).then(res => {
            if (res.data.callback === 200) {
                const {id, nickname} = res.data.user;
                const { accessToken, refreshToken } = res.data.token;
                axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
                SetUserInfo({
                    user_id : id,
                    user_nickname : nickname,
                    rule : 1,
                    access_token : accessToken,
                })
                router.push('/')
            }
        }).catch(err => {
            console.log(err)
        })
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };
    /**
     * ???????????? ???????????? ?????? ????????? ????????? ??????
     */
    const validatorPattern = async (str: string) => {
        if (str.search(/\W|\s/g) > -1) {
            return false
        } else {
            return true
        }
    }

    const styles = {
        height: "calc(var(--vh, 1vh) * 100)",
        backgroundColor: "#fff",
    };
    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <Layout style={styles}>
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
                            label="?????????"
                            name="id"
                            validateStatus="success"
                            rules={[
                                {
                                    required: true,
                                    message: "???????????? ???????????? ??????????????????!",
                                },
                                ({ getFieldValue }) => ({
                                    async validator(_, value) {
                                        try {
                                            let flag = await validatorPattern(value);
                                            if (flag) {
                                                let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check_id`, { params: { id: value } });
                                                if (res.data.callback === 200) {
                                                    return Promise.resolve();
                                                } else if (res.data.callback === 403) {
                                                    return Promise.reject(new Error("?????? ???????????? ??????????????????"))
                                                }
                                            } else {
                                                return Promise.reject(new Error("???????????? ????????? ????????? ????????? ???????????????."))
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
                            label="?????????"
                            name="nickname"
                            rules={[
                                {
                                    required: true,
                                    message: "???????????? ???????????? ??????????????????!",
                                },
                                ({ getFieldValue }) => ({
                                    async validator(_, value) {
                                        try {
                                            if (/\s/.test(value)) {
                                                return Promise.reject(new Error('???????????? ????????? ?????? ??? ??? ????????????.'));
                                            }
                                            let nicknameLength = 0;
                                            for (let i = 0; i < value.length; i += 1) {
                                                const char = value.charAt(i);
                                                if (escape(char).length > 4) {
                                                    nicknameLength += 2;
                                                } else {
                                                    nicknameLength += 1;
                                                }
                                            }
                                            if (nicknameLength < 2 || nicknameLength >= 20) {
                                                return Promise.reject(new Error('????????? ??????1~10???, ?????? ??? ?????? 2~20????????? ?????????????????????.'));
                                            }
                                            const regExp = /[^a-zA-Z0-9???-???_]/;
                                            if (regExp.test(value)) {
                                                return Promise.reject(new Error('???????????? ??????, ??????, ??????, _ ??? ????????? ??? ????????????.'));
                                            }
                                            /**
                                             * ???????????? ???????????? ?????? ????????? ????????? ??????
                                             */
                                            let res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/check_nickname`, { params: { nickname: value } });
                                            if (res.data.callback === 200) {
                                                return Promise.resolve();
                                            } else if (res.data.callback === 403) {
                                                return Promise.reject(new Error("?????? ???????????? ??????????????????"))
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
                            label="????????????"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "???????????? ??????????????? ??????????????????!",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            label="???????????? ??????"
                            name="confirm"
                            rules={[
                                {
                                    required: true,
                                    message: "???????????? ??????????????? ??????????????????!",
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("???????????? ??????????????? ???????????? ????????????"))
                                    }
                                })
                            ]}
                        >
                            <Input.Password style={{ imeMode: "disabled" }} />
                        </Form.Item>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 7,
                                span: 16,
                            }}
                        >
                            <Checkbox>?????????????????????</Checkbox>
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                offset: 7,
                                span: 16,
                            }}

                        >
                            <Button type="primary" htmlType="submit">
                                ????????????
                            </Button>
                        </Form.Item>
                    </Form>
                </Container>
            </Layout>
        </>
    );
};




export default Signup;
