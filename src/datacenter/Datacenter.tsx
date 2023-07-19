import { useState, useRef, FormEvent } from 'react';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { useStore } from '../store/useStore';
import { useQuery, useMutation, useQueryClient} from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from "cookie-universal"

export default function Datacentre() {

    const navigate = useNavigate()
    
    const { id } = useStore();
    const { setId } = useStore();

    const cookie = Cookie()

    const myToken = cookie.get("auth_Info")

    const queryClient = useQueryClient() 

    const toast = useRef<Toast>(null);

    const fetchData = () => { 
        return axios.get('https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/datacenters/all',{
            headers: {
            'Authorization': `token ${myToken}`
            }
        }
        ) 
    }

    const { data, refetch, isError, error } = useQuery ('data', fetchData)

    if(isError) {
        if ((error as Error).message === 'Request failed with status code 401') {
            navigate('/')  
        }
    }

    const deleteMethod = useMutation((id:number) => {
        return axios.delete(`https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/datacenters/remove/${id}`,
        {
        headers: {
            'Authorization': `token ${myToken}`
        }
        })
        },
        {
        onSuccess: () => {
            queryClient.invalidateQueries('data');
            toast.current?.show({severity:'success', summary: 'Success', detail:'delete is Completed', life: 3000});
        },
        onError: (error:Error) => {
            if (error.message === 'Request failed with status code 401') {
                navigate('/')  
            }
            toast.current?.show({severity:'error', summary: 'Error', detail:'delete is not Completed', life: 3000});
        },
        }
    ) 

    const data2 = data?.data.map((item:object,index:number) =>item = {...item,id:index});

    const [globalFilter, setGlobalFilter] = useState<string | null>(null);

    const [visible, setVisible] = useState<boolean>(false);

    const [visible2, setVisible2] = useState<boolean>(false);

    const [name, setName] = useState<string>('');

    const [url, setUrl] = useState<string>('');

    const [name2, setName2] = useState<string>('');

    const [url2, setUrl2] = useState<string>('');

    const openNew = () => {
        setVisible(true);
    }

    type row = {
        name: string,
        url: string,
        PK: number
    }

    const editRow = async (row: row) => {
        setVisible2(true);
        setName2(row.name)
        setUrl2(row.url)
        setId(row.PK)
    };

    const deleteRow =  (row: row) => { 
        deleteMethod.mutate(row.PK)
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Manage Products</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Search..." />
                <Button className='ml-3 mr-3' label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </span>
        </div>
    );

    const actionBodyTemplate = (rowData: row) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editRow(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => deleteRow(rowData)} />
            </>
        );
    }

    const handleVisible = () => {
        setVisible(false)
        setName('')
        setUrl('')
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault(); 
        try {
                await axios.post('https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/datacenters/add',
            {
                name:name,
                url:url  
            },
            {
                headers: {
                'Authorization': `token ${myToken}`
                }
            }
            )
            refetch()
            toast.current?.show({severity:'success', summary: 'Success', detail:'add is Completed', life: 3000});
            handleVisible()
        } catch (error) {
            if ((error instanceof Error)) {
                error.message === 'Request failed with status code 401' ? navigate('/') : null
            }
            toast.current?.show({severity:'error', summary: 'Error', detail:'add is not Completed', life: 3000});
        }
        
    }

    const handleUpdate = async (e:FormEvent) => {
        e.preventDefault();
        try {
                await axios.put('https://vv3eyp0jq4.execute-api.eu-central-1.amazonaws.com/test/api/dashboard/datacenters/update',
            {
                name:name2,
                url:url2,
                id: id
            },
            {
                headers: {
                'Authorization': `token ${myToken}`
                }
            }
            )
            refetch();
            toast.current?.show({severity:'success', summary: 'Success', detail:'update is Completed', life: 3000});
        } catch (error) {
            if ((error instanceof Error)) {
                error.message === 'Request failed with status code 401' ? navigate('/') : null
            }
            toast.current?.show({severity:'error', summary: 'Error', detail:'update is not Completed', life: 3000});
        }
    }


    return (
        <div className="card m-4">
            <Toast ref={toast} />
            <DataTable
            paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Datacentres"
            value={data2}
            globalFilter={globalFilter} header={header} tableStyle={{ minWidth: '50rem' }}>
                <Column field="id" header="Id" sortable></Column>
                <Column field="name" header="Name" sortable></Column>
                <Column field="url" header="Url" sortable></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
            </DataTable>
            <Dialog header="Add New" visible={visible} style={{ width: '30vw' }} onHide={() => handleVisible()}>
                <form onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Name</label>
                            <InputText required value={name}  onChange={(e) => setName(e.target.value)} id="username" aria-describedby="username-help" />
                        </div>
                        <div className="flex flex-column gap-2 my-4">
                            <label htmlFor="username">Url</label>
                            <InputText required value={url}  onChange={(e) => setUrl(e.target.value)} id="username" aria-describedby="username-help" />
                        </div>
                        <Button type="submit" label="Submit"/>   
                </form>
            </Dialog>
            <Dialog header="Update" visible={visible2} style={{ width: '30vw' }} onHide={() => setVisible2(false)}>
                <form onSubmit={handleSubmit}>
                        <div className="flex flex-column gap-2">
                            <label htmlFor="username">Name</label>
                            <InputText value={name2}  onChange={(e) => setName2(e.target.value)} id="username" aria-describedby="username-help" />
                        </div>
                        <div className="flex flex-column gap-2 my-4">
                            <label htmlFor="username">Url</label>
                            <InputText value={url2}  onChange={(e) => setUrl2(e.target.value)} id="username" aria-describedby="username-help" />
                        </div>
                        <Button type="submit" label="Save" onClick={handleUpdate} />   
                </form>
            </Dialog>
        </div>
    );
}
        