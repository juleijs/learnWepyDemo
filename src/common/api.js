import m_contacts from './../mocks/contact'
import m_history from './../mocks/history'
import m_reply from './../mocks/reply'
import global from './global'
import wepy from 'wepy'

export default {
    getRandomReply(id) {
        let template = m_reply[id]
        if (!template) {
            template = m_reply['other']
        }
        let index = Math.random() * template.length >> 0
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(template[index])
            })
        })
    },

    getContact() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(m_contacts)
            })
        })
    },

    getUserInfo() {
        return new Promise((resolve, reject) => {
            let cache = global.getUserInfo()
            if (cache) {
                resolve(cache)
            } else {
                wepy.login().then(loginRes => {
                    wepy.getUserInfo().then(infoRes => {
                        global.setUserInfo(infoRes.userInfo)
                        resolve(infoRes.userInfo)
                    }).catch(reject)
                }).catch(reject)
            }
        })
    },

    getHistory(id) {
        let history = wepy.getStorageSync('_wechat_history_') || m_history
        return new Promise((resolve, reject) => {
            setTimeout(() => {
              let sorted = history.sort((a, b) => {a.time - b.time})
                if (!id) {
                    resolve(this.leftJoin(sorted, m_contacts))
                } else {
                    resolve(this.leftJoin(sorted.filter(v => {v.from === id || v.to === id}), m_contacts))
                }
            })
        })
    },

    leftJoin(original, contacts) {
        let contactObj = global.getContact()
        let rst = []
        original.forEach(v => {
            if (!v.id) {
                v.id = v.from !== 'me' ? v.from : v.to
            } else {
                if (v.id !== 'me') {
                    v.name = contactObj[v.id].name
                    v.icon = (wepy.env === 'web' ? './mocks/users/' : './../mocks/users/') + contactObj[v.id].id + '.png'
                }
                rst.push(v)
            }
        })
        return rst
    },

    getMessageList() {
        let history = wepy.getStorageSync('_wechat_history_') || m_history
        return new Promise((resolve, reject) => {
            let distince = []
            let rst = []
            let sorted = history.sort((a, b) => {b.time - a.time})
            sorted.forEach(v => {
                if (v.from !== 'me' && distince.indexOf(v.from) !== -1) {
                    distince.push(v.from)
                }
                if (v.to !== 'me' && distince.indexOf(v.to) !== -1) {
                    distince.push(v.to)
                }
            })

            distince.forEach(v => {
                let pmsg = sorted.filter(msg => msg.to === v || msg.from === v)
                let lastpmsg = pmsg.length ? pmsg[0].msg : ''
                rst.push({
                    id: v,
                    lastpmsg
                })
            })

            setTimeout(() => {
              resolve(this.leftJoin(rst, m_contacts))
            })
        })
    },

    msg(frm, to, msg, type = 'text') {
        let history = wepy.getStorageSync('_wechat_history_') || m_history
        let msgObj = {
            from: frm,
            to,
            msg,
            type,
            time: +new Date()
        }
        history.push(msgObj)
        return new Promise((resolve, reject) => {
            wepy.setStorage({key: '_wechat_history_', data: history}).then(() => {
                resolve(msgObj)
            }).catch(reject)
        })
    },

    sendMsg(to, msg, type = 'text') {
        this.msg('me', to, msg, type)
    },

    replyMsg(frm, msg, type = 'text') {
        this.msg(frm, 'me', msg, type)
    },

    clearMsg(id) {
        return wepy.clearStorage()
    }
}
