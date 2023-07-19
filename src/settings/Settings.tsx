import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { useQuery } from 'react-query';
import axios from 'axios';
import Cookie from "cookie-universal"
import { useNavigate } from 'react-router-dom';

export default function Settings() {

    const navigate = useNavigate()

    const cookie = Cookie()

    const myToken = cookie.get("auth_Info")
    
    const fetchSettings = () => {
        return axios.get('https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/settings/all',{
            headers: {
                'Authorization': `token ${myToken}`
            }
        }
        )  
    } 
    
    const { data, isError, error } = useQuery ('settings', fetchSettings)

    if(isError) {
        if (error.message === 'Request failed with status code 401') {
            navigate('/')  
        }
    }


    const [globalFilter, setGlobalFilter] = useState<string | null>(null);

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e:any) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    return (
        <div className="card m-4">
            <DataTable
            paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} settings"
            value={data?.data} globalFilter={globalFilter} header={header} tableStyle={{ minWidth: '50rem' }}>
                <Column field="key" header="Key" sortable></Column>
                <Column field="value" header="Value" sortable></Column>
            </DataTable>
        </div>
    );
}
        