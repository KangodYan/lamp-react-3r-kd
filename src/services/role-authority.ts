import { useMutation, useQuery } from '@tanstack/react-query';

import { AxiosError } from 'axios';

import { service } from '@/http/axios/service';
import { globalError, globalSuccess } from '@/utils/antd-extract';
import { ResponseResultType } from '@/utils/types';
import { InputType } from '@/views/setting/roles/resource-allot.page';

/**
 * 分组菜单和资源的查询
 */
export const useListRoleAuthorityId = (values?: InputType) => {
    return useQuery(['listRoleAuthorityId', values], () =>
        service
            .get('role-authority/listRoleAuthorityId', { params: values })
            .then((res) => res.data),
    );
};

/**
 * 保存角色授权数据，删除再批量插入
 */
export const useSaveBatchRoleAutority = () => {
    return useMutation(
        async (params: InputType) =>
            service.post('role-authority/saveBatchRoleAutority', { ...params }),
        {
            onSuccess: () => {
                globalSuccess();
            },
            onError: (error: AxiosError<ResponseResultType>) => globalError(error),
        },
    );
};
