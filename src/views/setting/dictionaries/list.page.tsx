import {
    Button,
    Card,
    Col,
    Divider,
    Dropdown,
    Form,
    Input,
    MenuProps,
    Pagination,
    Row,
    Table,
    message,
} from 'antd';

import { useState } from 'react';

import { DownOutlined } from '@ant-design/icons';

import { useDelDicts, useListType, useListDictSingleType } from '@/services/dictionary';

import { listTypeColumns, listColumns, OutputType, InputType } from './constants';
import { DictionaryRightEditForm } from './edit.page';
import { DictionaryLeftEditForm } from './left-edit.page';

export default () => {
    const [form] = Form.useForm();
    // 状态定义
    const [clickType, setClickType] = useState<string>('');
    const [code, setCode] = useState<string>();
    const [name, setName] = useState<string>();
    const [pageQ, setPageQ] = useState<number>(1);
    const [limitQ, setLimitQ] = useState<number>(10);
    const [listTitle, setListTitle] = useState<string>('');
    // API-hooks
    const { mutateAsync: delMutate, isLoading: delLoading } = useDelDicts();
    const {
        data: listTypeData,
        isLoading: listTypeLoading,
        refetch: listTypeRefetch,
    } = useListType();
    const { listDataItems, listMeta, listLoading } = useListDictSingleType(
        clickType,
        pageQ,
        limitQ,
        code,
        name,
    );
    // ==========左边栏处理==========
    // ......
    const onTypePageChange = (_page: number, _pageSize: number) => {
        // ......
    };
    // 打开编辑表单处理器，点击按钮触发
    const [clickDictLeft, setClickDictLeft] = useState<OutputType>();
    const [showInfoLeft, setShowInfoLeft] = useState(false);
    const onOpenFormHandlerLeft = (record?: OutputType) => {
        if (record) {
            setClickDictLeft(record);
        } else {
            const defaultRecord = { type: '', label: '', state: true };
            setClickDictLeft(defaultRecord);
        }
        setShowInfoLeft(true);
    };
    // 关闭模态窗口并刷新数据
    const closeAndRefetchHandlerLeft = async (isReload?: boolean) => {
        setShowInfoLeft(false);
        if (isReload) {
            listTypeRefetch();
        }
    };
    // 删除处理器，点击删除按钮触发API调用
    const onDelHandlerLeft = async (ids: number[]) => {
        await delMutate(ids);
        listTypeRefetch();
    };
    // 表单提交处理
    const onFinishHandlerLeft = (values: InputType) => {
        setCode(values.code);
        setName(values.name);
    };
    // 顶部「更多」表单处理
    const dropdownMenuItems: MenuProps['items'] = [
        {
            key: '1',
            label: (
                <Button
                    className="text-black"
                    block
                    type="link"
                    onClick={() => onOpenFormHandlerLeft()}
                >
                    添加
                </Button>
            ),
        },
        {
            key: '2',
            label: (
                <Button
                    className="text-black"
                    block
                    type="link"
                    onClick={() => batchDelHandlerLeft()}
                >
                    删除
                </Button>
            ),
        },
    ];
    // 多选框处理
    const [selectedRowKeysLeft, setSelectedRowKeysLeft] = useState<React.Key[]>([]);
    const [selectedIdsLeft, setSelectedIdsLeft] = useState<number[]>();
    const batchDelHandlerLeft = async () => {
        if (!selectedIdsLeft) {
            message.error('请勾选数据之后删除');
            return;
        }
        // delMutate(selectedIdsLeft);
        setSelectedIdsLeft(undefined);
        setSelectedRowKeysLeft([]);
    };
    const rowSelectionLeft = {
        // 指定选中项的 key 数组，从0开始的下标，用于控制数据的勾选，自动的本来可以，手动主要用于删除后的清除
        selectedRowKeys: selectedRowKeysLeft,
        // 选中项发生变化时的回调
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: OutputType[]) => {
            // 用于显示勾选项
            setSelectedRowKeysLeft(newSelectedRowKeys);
            // 删除时的ids传值
            const ids: number[] = [];
            selectedRows.forEach((val, index) => {
                ids[index] = val.id!;
            });
            setSelectedIdsLeft(ids);
        },
    };
    // ==========右边栏处理==========
    // 字典详情分页改变处理
    const onListPageChange = (page: number, pageSize: number) => {
        setPageQ(page);
        setLimitQ(pageSize);
    };
    // 打开编辑表单处理器，点击按钮触发
    const [clickDict, setClickDict] = useState<OutputType>();
    const [showInfo, setShowInfo] = useState(false);
    const onOpenFormHandler = (record?: OutputType) => {
        if (record) {
            setClickDict(record);
        } else {
            const defaultRecord = { type: clickType, label: listTitle, state: true };
            setClickDict(defaultRecord);
        }
        setShowInfo(true);
    };
    // 关闭模态窗口并刷新数据
    const closeHandler = async () => {
        setShowInfo(false);
    };
    // 删除处理器，点击删除按钮触发API调用
    const onDelHandler = async (ids: number[]) => {
        delMutate(ids);
    };
    // 表单提交处理
    const onFinishHandler = (values: InputType) => {
        setCode(values.code);
        setName(values.name);
    };
    // 重置表单处理
    const resetHandler = () => {
        form.resetFields();
        setCode('');
        setName('');
    };
    // 多选框处理
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>();
    const batchDelHandler = async () => {
        if (!selectedIds) {
            message.error('请勾选数据之后删除');
            return;
        }
        delMutate(selectedIds);
        setSelectedIds(undefined);
        setSelectedRowKeys([]);
    };
    const rowSelection = {
        // 指定选中项的 key 数组，从0开始的下标，用于控制数据的勾选，自动的本来可以，手动主要用于删除后的清除
        selectedRowKeys,
        // 选中项发生变化时的回调
        onChange: (newSelectedRowKeys: React.Key[], selectedRows: OutputType[]) => {
            // 用于显示勾选项
            setSelectedRowKeys(newSelectedRowKeys);
            // 删除时的ids传值
            const ids: number[] = [];
            selectedRows.forEach((val, index) => {
                ids[index] = val.id!;
            });
            setSelectedIds(ids);
        },
    };
    return (
        <div>
            <Row>
                <Col>
                    <Card title="字典列表" style={{ width: 450 }}>
                        <Form form={form} onFinish={onFinishHandlerLeft}>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item name="keyword">
                                        <Input placeholder="关键字" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            搜索
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Dropdown menu={{ items: dropdownMenuItems }}>
                                        <Button>
                                            更多
                                            <DownOutlined />
                                        </Button>
                                    </Dropdown>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            rowKey="id"
                            rowSelection={{
                                ...rowSelectionLeft,
                            }}
                            bordered
                            loading={listTypeLoading}
                            columns={listTypeColumns({ onOpenFormHandlerLeft, onDelHandlerLeft })}
                            dataSource={listTypeData?.items}
                            pagination={false}
                            // record的类型为Antd中的InputType，找不到所以抽取不了，就写在这里了
                            onRow={(record: OutputType) => {
                                return {
                                    onClick: () => {
                                        setClickType(record.type);
                                        setListTitle(record.label);
                                    },
                                };
                            }}
                        />
                        <Divider />
                        <Pagination
                            showSizeChanger
                            onChange={onTypePageChange}
                            total={listTypeData?.meta?.totalItems}
                            current={listTypeData?.meta?.currentPage}
                            showTotal={(total: number) => `共 ${total} 条`}
                        />
                        {/* 弹出层表单 */}
                        {showInfoLeft && (
                            <DictionaryLeftEditForm
                                clickDict={clickDictLeft}
                                onClose={closeAndRefetchHandlerLeft}
                            />
                        )}
                    </Card>
                </Col>
                <Col>
                    <Card
                        title={`${listTitle ? `[${listTitle}]` : ''}字典详情`}
                        style={{ width: 800 }}
                    >
                        <Form form={form} onFinish={onFinishHandler}>
                            <Row gutter={24}>
                                <Col span={6}>
                                    <Form.Item name="code">
                                        <Input placeholder="编码" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item name="name">
                                        <Input placeholder="名称" allowClear />
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            搜索
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={resetHandler}>
                                        重置
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={() => onOpenFormHandler()}>
                                        添加
                                    </Button>
                                </Col>
                                <Col span={3}>
                                    <Button type="primary" onClick={() => batchDelHandler}>
                                        删除
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                        <Table
                            rowKey="id"
                            rowSelection={{
                                ...rowSelection,
                            }}
                            bordered
                            loading={delLoading || (clickType !== '' && listLoading)}
                            columns={listColumns({ onOpenFormHandler, onDelHandler })}
                            dataSource={listDataItems}
                            pagination={false}
                        />
                        {listMeta?.totalItems !== 0 && (
                            <div>
                                <Divider />
                                <Pagination
                                    showSizeChanger
                                    onChange={onListPageChange}
                                    showTotal={(total: number) => `共 ${total} 条`}
                                    total={listMeta?.totalItems}
                                    current={listMeta?.currentPage}
                                />
                            </div>
                        )}
                        {/* 弹出层表单 */}
                        {showInfo && (
                            <DictionaryRightEditForm clickDict={clickDict} onClose={closeHandler} />
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
