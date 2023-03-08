import React, { useState, useEffect, useContext } from "react";
import styles from "./index.module.scss";
import { Button, Drawer, Form, message, Space, Tooltip } from "antd";
import { formatArrayToTimeMap } from "./utils";
import List from "./list";
import DoneList from "./done-list";
import PoolList from "./pool-list";
import moment from "moment";
import { getTodoList } from "@/client/TodoListHelper";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import EditTodoModal from "./component/edit-todo-modal";
import { TodoItemType, StatusType, TodoStatus, OperatorType } from "./types";
import {
    AimOutlined,
    ArrowLeftOutlined,
    BookOutlined,
    QuestionCircleOutlined,
    StarFilled,
} from "@ant-design/icons";
import { TodoProvider } from "./TodoContext";
import { ThemeContext } from "@/context/ThemeContext";
import { SortKeyMap } from "./component/sort-btn";
import PunchTheClockModal from "./component/punch-the-clock-modal";
import TodoNote from "../todo-note";

const TodoList: React.FC = () => {
    const { theme } = useContext(ThemeContext);

    useDocumentTitle("todo-list");

    const [todoLoading, setTodoLoading] = useState<boolean>(false);
    const [poolLoading, setPoolLoading] = useState<boolean>(false);
    const [targetLoading, setTargetLoading] = useState<boolean>(false);
    const [bookMarkLoading, setBookMarkLoading] = useState<boolean>(false);

    const [isRefreshDone, setIsRefreshDone] = useState<boolean>(false);

    const [isShowDoneTarget, setIsShowDoneTarget] = useState<boolean>(false);

    const getTodo = async (type: StatusType) => {
        if (type === "bookMark") {
            setBookMarkLoading(true);
            const req: any = {
                isBookMark: "1",
                pageNo: 1,
                pageSize: 100,
            };
            const res = await getTodoList(req);
            if (res) {
                setBookMarkList(res.data.list);
                setBookMarkLoading(false);
            } else {
                message.error("获取 todolist 失败");
            }
        } else if (type === "target") {
            setTargetLoading(true);
            const req: any = {
                isTarget: "1",
                pageNo: 1,
                pageSize: 100,
            };
            const res = await getTodoList(req);
            if (res) {
                setTargetList(res.data.list);
                setTargetLoading(false);
            } else {
                message.error("获取 todolist 失败");
            }
        } else if (type === "done") {
            setIsRefreshDone(true);
        } else {
            type === "todo" && setTodoLoading(true);
            type === "pool" && setPoolLoading(true);

            const req: any = {
                status: TodoStatus[type],
            };

            const res = await getTodoList(req);
            if (res) {
                if (type === "todo") {
                    setTodoList(res.data);
                    setTodoLoading(false);
                }
                if (type === "pool") {
                    setPoolList(res.data);
                    setPoolLoading(false);
                }
            } else {
                message.error("获取 todolist 失败");
            }
        }
    };

    useEffect(() => {
        getTodo("todo");
        getTodo("done");
        getTodo("pool");
        getTodo("target");
        getTodo("bookMark");
    }, []);

    // 列表
    const [todoList, setTodoList] = useState<TodoItemType[]>([]);
    const [poolList, setPoolList] = useState<TodoItemType[]>([]);
    const [targetList, setTargetList] = useState<TodoItemType[]>([]);
    const [bookMarkList, setBookMarkList] = useState<TodoItemType[]>([]);
    // 编辑相关
    const [operatorType, setOperatorType] = useState<OperatorType>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [activeTodo, setActiveTodo] = useState<TodoItemType>();
    // 打卡相关
    const [showPunchTheClock, setShowPunchTheClock] = useState<boolean>(false);

    const handleAdd = () => {
        setActiveTodo(undefined);
        setOperatorType("add");
        setShowEdit(true);
        form.setFieldsValue({
            time: moment(),
            status: TodoStatus.todo,
            color: "3",
            category: "个人",
        });
    };

    const handleEdit = (item: TodoItemType) => {
        setActiveTodo(item);
        if (item.isTarget === "1" && !!item.timeRange) {
            setShowPunchTheClock(true);
        } else {
            setOperatorType("edit");
            setShowEdit(true);
        }
    };

    useEffect(() => {
        if (activeTodo) {
            const item = activeTodo;
            form.setFieldsValue({
                name: item.name,
                description: item.description,
                time: moment(item.time),
                status: Number(item.status),
                color: item.color,
                category: item.category,
                other_id: item.other_id,
                doing: item.doing,
                isNote: item.isNote,
                isTarget: item.isTarget,
                isBookMark: item.isBookMark,
            });
        }
    }, [activeTodo]);

    const [form] = Form.useForm();

    const refreshData = (
        type?: "todo" | "done" | "pool" | "target" | "bookMark"
    ) => {
        if (!type) {
            getTodo("todo");
            getTodo("done");
            getTodo("pool");
            getTodo("target");
            getTodo("bookMark");
        } else {
            type === "todo" && getTodo("todo");
            type === "done" && getTodo("done");
            type === "pool" && getTodo("pool");
            type === "target" && getTodo("target");
            type === "bookMark" && getTodo("bookMark");
        }
    };

    const [showBookMarkDrawer, setShowBookMarkDrawer] = useState<boolean>(false);
    const [showNoteDrawer, setShowNoteDrawer] = useState<boolean>(false);

    const today = moment().format("YYYY-MM-DD");

    return (
        <div className={styles.todoList}>
            <div>
                <div className={styles.Layout}>
                    {/* 之后待办 */}
                    <div className={`${styles.box1} ScrollBar`}>
                        <List
                            loading={todoLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.after}
                            key="after"
                            title="之后待办"
                            mapList={formatArrayToTimeMap(
                                todoList.filter((item) => item.time > today)
                            )}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                        />
                    </div>
                    {/* 待办 */}
                    <div className={`${styles.box2} ScrollBar`}>
                        <List
                            loading={todoLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.todo}
                            title={
                                <>
                                    今日待办{" "}
                                    <Tooltip
                                        title={
                                            <>
                                                <div>
                                                    <AimOutlined
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是目标
                                                </div>
                                                <div>
                                                    <BookOutlined
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是已存档
                                                </div>
                                                <div>
                                                    <StarFilled
                                                        style={{
                                                            marginRight: 5,
                                                            color: "#ffeb3b",
                                                        }}
                                                    />
                                                    这个是书签
                                                </div>
                                                <div>
                                                    整个 title
                                                    变黄，是指现在处理。
                                                </div>
                                            </>
                                        }
                                        placement="bottom"
                                    >
                                        <QuestionCircleOutlined
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Tooltip>{" "}
                                </>
                            }
                            mapList={formatArrayToTimeMap(
                                todoList.filter(
                                    (item) =>
                                        item.time <= today &&
                                        item.isTarget !== "1"
                                )
                            )}
                            handleAdd={handleAdd}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                            showRefresh={true}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 已完成 */}
                    <div className={`${styles.box3}`}>
                        <Space>
                            <Button type="primary" onClick={() => {setShowBookMarkDrawer(true)}}>书签</Button>
                            <Button type="primary" onClick={() => {setShowNoteDrawer(true)}}>存档</Button>
                        </Space>
                        <div className="ScrollBar">
                            <DoneList
                                title="已完成"
                                key="done"
                                sortKey={SortKeyMap.done}
                                handleEdit={handleEdit}
                                isRefreshDone={isRefreshDone}
                                setIsRefreshDone={setIsRefreshDone}
                                refreshData={refreshData}
                            />
                        </div>
                    </div>
                    {/* 待办池 */}
                    <div className={`${styles.box4} ScrollBar`}>
                        <PoolList
                            loading={poolLoading}
                            sortKey={SortKeyMap.pool}
                            getTodo={getTodo}
                            title="待办池"
                            mapList={poolList}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                            showDoneIcon={true}
                        />
                    </div>
                    {/* 目标 */}
                    <div className={`${styles.box5} ScrollBar`}>
                        <PoolList
                            loading={targetLoading}
                            getTodo={getTodo}
                            sortKey={SortKeyMap.target}
                            title="目标"
                            showSearch={false}
                            btn={
                                <>
                                    <Button
                                        onClick={() =>
                                            setIsShowDoneTarget((prev) => !prev)
                                        }
                                        type={
                                            !isShowDoneTarget
                                                ? "default"
                                                : "primary"
                                        }
                                    >
                                        {!isShowDoneTarget
                                            ? "未完成"
                                            : "已完成"}
                                    </Button>
                                </>
                            }
                            mapList={targetList
                                .filter((item) =>
                                    isShowDoneTarget
                                        ? item.status ===
                                          String(TodoStatus.done)
                                        : item.status !==
                                          String(TodoStatus.done)
                                )
                                .sort(
                                    (a, b) => Number(a.color) - Number(b.color)
                                )}
                            handleEdit={handleEdit}
                            refreshData={refreshData}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles.bookMark}
                onMouseEnter={() => setShowBookMarkDrawer(true)}
                onClick={() => {
                    setShowBookMarkDrawer(true);
                }}
            >
                <ArrowLeftOutlined />
            </div>
            {/* 书签展示的抽屉 */}
            <Drawer
                closable={false}
                className={`${styles.bookMarkDrawer} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                visible={showBookMarkDrawer}
                onClose={() => setShowBookMarkDrawer(false)}
                width="600px"
            >
                <PoolList
                    loading={bookMarkLoading}
                    getTodo={getTodo}
                    title="书签"
                    sortKey={SortKeyMap.bookmark}
                    mapList={bookMarkList.sort(
                        (a, b) => Number(a.color) - Number(b.color)
                    )}
                    handleEdit={handleEdit}
                    refreshData={refreshData}
                />
            </Drawer>
            {/* todo note 展示的抽屉 */}
            <Drawer
                closable={false}
                className={`${styles.bookMarkDrawer} ${
                    theme === "dark" ? "darkTheme" : ""
                }`}
                visible={showNoteDrawer}
                onClose={() => setShowNoteDrawer(false)}
                width="800px"
            >
                <TodoNote />
            </Drawer>
            {/* 新增/编辑 todo */}
            <EditTodoModal
                type={operatorType || "add"}
                setType={setOperatorType}
                visible={showEdit}
                onClose={() => {
                    setActiveTodo(undefined);
                    setShowEdit(false);
                    form.resetFields();
                }}
                activeTodo={activeTodo}
                setActiveTodo={setActiveTodo}
                form={form}
                refreshData={refreshData}
            />
            {/* 打卡详情 */}
            <PunchTheClockModal
                visible={showPunchTheClock}
                onClose={() => {
                    setActiveTodo(undefined);
                    setShowPunchTheClock(false);
                }}
                activeTodo={
                    showPunchTheClock
                        ? targetList.find(
                              (item) => item.todo_id === activeTodo?.todo_id
                          )
                        : undefined
                }
                refreshData={refreshData}
            />
        </div>
    );
};

const TodoListWrapper: React.FC = () => (
    <TodoProvider>
        <TodoList />
    </TodoProvider>
);

export default TodoListWrapper;
