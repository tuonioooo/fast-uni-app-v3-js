import goods from "@/api/data/goods";

const loadingTime = 500;
const showLog = false;

/* 这个ts仅用于在demo中模拟网络请求，请勿导入或修改此文件。实际项目中在queryList中调用自己的请求即可 */

// 查询普通列表数据
export function queryList(data) {
    const listCount = 24;
    return _queryList(data, listCount);
}

// 查询超长列表数据
function queryListLong(data) {
    const listCount = 100000;
    return _queryList(data, listCount, true, data.random);
}

// 查询聊天记录列表数据
function queryChatList(data) {
    const listCount = 24;
    return _queryList(data, listCount, false, false, true);
}

// 查询超长聊天记录列表数据
function queryChatListLong(data) {
    const listCount = 100000;
    return _queryList(data, listCount, false, false, true);
}

// 查询tabs数据
export function queryTabs(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['测试1','测试2','测试3','测试4']);
        }, loadingTime)
    })
}

function _queryList(data, listCount, showNews = false ,random = false, showChat = false) {
    if (!data.pageNo || !data.pageSize) {
        return _callQueryResult([]);
    }
    let pageNo = parseInt(data.pageNo);
    let pageSize = parseInt(data.pageSize);
    let type = data.type || 0;
    if (pageNo < 0 || pageSize <= 0) {
        return _callQueryResult([]);
    }
    if (showLog) {
        console.log('%c\n----------请求开始--------', 'color:green;');
        console.info(`请求参数：【pageNo:${pageNo},pageSize:${pageSize}】`)
        console.log('%c----------请求结束--------\n', 'color:green;');
    }
    uni.showLoading({
        title: '加载中...'
    })
    if (pageNo == 0) {
        pageNo = 1;
    }
    var totalPagingList = [];
    for (let i = 0; i < listCount; i++) {
        if (!showChat) {
            const item = {
                'title': (i + 1).toString(),
                'detail': '测试信息' + type
            };
            if (showNews) {
                item.detail = getNews(random);
            }
            totalPagingList.push(item);
        } else {
            const item = {
                'name': '哆啦A梦',
                'icon': '/static/duola.jpg',
                'content': getNews(true),
                'isMe': false
            };
            totalPagingList.push(item);
        }
    }
    let pageNoIndex = (pageNo - 1) * pageSize;
    if (pageNoIndex + pageSize <= totalPagingList.length) {
        return _callQueryResult(totalPagingList.splice(pageNoIndex, pageSize));
    } else if (pageNoIndex < totalPagingList.length) {
        return _callQueryResult(totalPagingList.splice(pageNoIndex, totalPagingList.length - pageNoIndex));
    } else {
        return _callQueryResult([]);
    }
}

function _callQueryResult(arg) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            uni.hideLoading();
            if (showLog) {
                console.log('%c\n----------响应开始--------', 'color:#0113fa;');
                // #ifdef H5
                console.table(arg);
                // #endif

                // #ifndef H5
                console.log(arg);
                // #endif
                console.log('%c----------响应结束--------\n', 'color:#0113fa;');
            }
            resolve({
                data: {
                    list: arg
                }
            });
        }, loadingTime)
    })
}

function getNews(random) {
    const newses = [
        '神舟十三凯旋归来，神舟十四号正在进行紧锣密鼓地组装和测试。',
        '差不多3个小时的等待后，终于等来了警察。一辆警车，闪着警灯，在前头开道。高音喇叭响着，“大车司机不许下车，跟我走。”4月19日，烟台港。43岁的卡车司机张广忠和他的卡车，都要在这坐轮渡去大连。见到穿防护服的工作人员，他立马戴上口罩，抓起购票时给的封条，跳下驾驶室。',
        '根据世卫组织最新实时统计数据，截至欧洲中部夏令时间4月29日17时47分（北京时间4月29日23时47分），全球累计新冠肺炎确诊病例510270667例，累计死亡病例6233526例。29日全球新冠肺炎确诊病例新增607159例，死亡病例新增2504例。（总台记者 朱赫）',
        '话剧《简·爱》经典再启 朱杰濮存昕携手演绎',
        '年初北京冬奥会，中国男冰首次参赛，虽没能拿到一场胜利，但小伙子们打出了可贵的精神。两周前，以征战冬奥会为班底的中国男冰在意大利集结，备战世锦赛乙级A组比赛。今年的乙级A组比赛在克罗地亚萨格勒布进行，与中国男冰同组的有以色列、荷兰、克罗地亚和西班牙队。从乙级A组这几支队伍水平来看，世界排名第27位的中国队实力占优。前两轮比赛，中国队先是14比1大胜以色列队，随后5比1战胜同组实力最强的荷兰队。连胜两场后，叶劲光、郑恩来、福帅等中国队员均表示，要再接再厉提前完成升组任务。',
        '中国物流与采购联合会、国家统计局服务业调查中心今天（4月30日）发布，4月份中国制造业采购经理指数（PMI）为47.4%，较上月下降2.1个百分点。',
        '德国化工巨头巴斯夫官网4月29日消息，2022年一季度，公司实现销售额230.83亿欧元（折合人民币1602.58亿元，下同），同比增长19%；不计特殊项目的息税前收益达28.18亿欧元（195.65亿元），同比增长21.4%；净收益12.21亿欧元（84.77亿元），同比下滑28.9%。',
        '北京时间2022年4月30日11时30分，我国在东海海域使用长征十一号海射遥三火箭发射吉林一号高分03D（04~07）/04A卫星，卫星顺利进入预定轨道，发射任务获得圆满成功。该卫星主要为国土资源普查、城市规划、灾害监测等行业领域提供商业遥感服务。',
        '人民日报写在“五一”国际劳动节：团结奋斗，在新征程上创造新的历史伟业'
    ]
    return newses[random ? Math.floor(Math.random() * newses.length) : 0];
}


function apiNewList(pageNum, pageSize) {
    return new Promise((resolute, reject)=>{
        //延时一秒,模拟联网
        setTimeout(function() {
            try {
                let list = [];
                if (!pageNum) {
                    //模拟下拉刷新返回的数据
                    let id=new Date().getTime();
                    let newObj = {
                        id:id,
                        title: "【新增新闻" + id + "】 标题",
                        content: "新增新闻的内容"
                    };
                    list.push(newObj);
                } else {
                    //模拟上拉加载返回的数据
                    for (let i = 0; i < pageSize; i++) {
                        let upIndex = (pageNum - 1) * pageSize + i + 1;
                        let newObj = {
                            id:upIndex,
                            title: "【新闻" + upIndex + "】 标题标题标题标题标题",
                            content: "内容内容内容内容内容内容内容内容内容"
                        };
                        list.push(newObj);
                    }
                    console.log("apiNewList: page.num=" + pageNum + ", page.size=" + pageSize + ", curPageData.length=" + list.length);
                }
                //模拟接口请求成功
                resolute(list);
            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        }, 1000)
    })
}


// 搜索商品
function apiGoods(pageNum, pageSize, keyword) {
    return new Promise((resolute, reject)=>{
        //延时一秒,模拟联网
        setTimeout(()=> {
            try{
                let data = {
                    list: [], // 数据列表
                    totalCount: 0, // 总数量
                    totalPage: 0, // 总页数
                    hasNext: false // 是否有下一页
                }

                // 符合关键词的记录
                let keywordList = [];
                if (!keyword || keyword == "全部") {
                    // 搜索全部商品
                    keywordList = goods;
                }else{
                    // 关键词搜索
                    if(keyword=="母婴") keyword="婴"; // 为这个关键词展示多几条数据
                    for (let i = 0; i < goods.length; i++) {
                        let good = goods[i]
                        if (good.goodName.indexOf(keyword) !== -1) {
                            keywordList.push(good)
                        }
                    }
                }

                // 分页
                for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
                    if (i >= keywordList.length) break
                    data.list.push(keywordList[i])
                }

                // 汇总数据
                data.totalCount = keywordList.length;
                data.totalPage = Math.ceil(data.totalCount/pageSize);
                data.hasNext = pageNum < data.totalPage

                //模拟接口请求成功
                console.log("apiGoods: pageNum=" + pageNum + ", pageSize=" + pageSize + ", data.list.length=" + data.list.length + ", totalCount=" + data.totalCount + ", totalPage=" + data.totalPage + ", hasNext=" + data.hasNext + (keyword ? ", keyword=" + keyword : ""));
                resolute(data);
            } catch (e) {
                //模拟接口请求失败
                reject(e);
            }
        },1000)
    })
}

export default {
    queryList,
    queryListLong,
    queryChatList,
    queryChatListLong,
    queryTabs,
    apiGoods,
    apiNewList
}
