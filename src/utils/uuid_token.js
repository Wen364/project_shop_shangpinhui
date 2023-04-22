// 引入 uuid
import { v4 as uuidv4 } from 'uuid';
export const getUUID = () =>{
    // 先从本地存储获取 UUID 如果有的话，则使用本地存储的，否则新创建一个
    let uuid_token = localStorage.getItem('UUID')
    if(uuid_token) {
        return uuid_token
    }else{
        // 随机生成一个 uuid 身份
        uuid_token = uuidv4()
        // 存入本地存储里
        localStorage.setItem('UUID',uuid_token)
    }
    return uuid_token
} 