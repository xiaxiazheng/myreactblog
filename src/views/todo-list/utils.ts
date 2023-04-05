import dayjs from "dayjs";
import { message } from "antd";
import { StatusType, TodoStatusMap } from "./types";

export const formatArrayToTimeMap = (list: any[]) => {
    return list.reduce((prev, cur) => {
        prev[cur.time] =
            typeof prev[cur.time] === "undefined"
                ? [cur]
                : prev[cur.time].concat(cur);
        return prev;
    }, {});
};

const weekList = ["日", "一", "二", "三", "四", "五", "六"];
export const getWeek = (time: string) => {
    return `周${weekList[dayjs(time).day()]}`;
};

export const colorMap: any = {
    0: "#f5222d",
    1: "#fa8c16",
    2: "#40a9ff",
    3: "#827e7e",
    [-1]: "#00d4d8",
    // [-1]: "#9c27b0",
    // [-2]: "#20d420",
};

export const colorNameMap: any = {
    0: "重要紧急",
    1: "紧急",
    2: "重要",
    3: "普通",
    [-1]: "自定义",
    // [-2]: "短期目标",
};

export const colorList = Object.keys(colorNameMap);

export const handleSortColor = () => {};

// 确定 todo 的刷新范围
export const handleRefreshList = (formData: any) => {
    const list: StatusType[] = [];
    if (formData.isTarget === "1") {
        list.push("target");
    }
    if (formData.isBookMark === "1") {
        list.push("bookMark");
    }
    list.push(TodoStatusMap[formData.status]);

    return list;
};

export const handleCopy = (str: string) => {
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value = str;
    input.select();
    document.execCommand("copy");
    message.success("已复制到粘贴板");
    document.body.removeChild(input);
};

let timer: any = 0;
export const debounce = (fn: () => void, ms: number) => {
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn();
        }, ms);
    }
};
