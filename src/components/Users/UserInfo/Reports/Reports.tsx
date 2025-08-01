import { useAuth } from "../../../../utils/hooks/Auth";
import UserInfo from "../UserInfo";
import Table from "../../../Commons/Table";
import { get_user_measurements, delete_measurement } from "../../../../api/measurements/measurements";
import { useApiGet } from "../../../../utils/hooks/query";
import moment from "moment";

export default function UserReports(){
    const { currentUser } = useAuth()
    const athlete_id = currentUser?.id
    const {
            data,
            isLoading,
            error,
            isError
        } = useApiGet(["user_measurements", athlete_id], ()=> get_user_measurements(athlete_id))

    let data_to_render = []

    data && data.forEach(item => {
        console.log(item)
        data_to_render.push({
            id: item.id,
            activity: item.sub_activity.translations[0].name,
            measurement: item.attribute.translations[0].name,
            results: item.value + item.attribute.translations[0].units,
            device: item.device.device_type.name,
            start: item.start,
            created_at: item.created_at,
            updated_at: item.updated_at
        })
    })

    const table_columns = [
        {
            header: "Activity", accessorKey: "activity",
            cell: ({cell, row}) => {
                // console.log(row.original.start, "row")
                // <a className="" href="">
                    return <div>
                    {row.original.start === true && row.original.activity}
                    </div>
                // </a>
            }
        },
        {
                    header: "Date/Time",
                    accessorKey: "created_at",
                    cell: ({cell, row}) => {
                        return row.original.start === true &&  <p>{moment.utc(row.original.created_at).local().format("YYYY-MM-DD HH:mm:ss")}</p>
                    }
                },
            // {header: "Device", accessorKey: "device"},
        {header: "Attribute", accessorKey: "measurement"},
        {header: "Results", accessorKey: "results"}
        // {
        //     header: "Delete",
        //     accessorKey: "id",
        //     cell: ({cell, row}) => {
        //         return <div onClick={()=>{
        //             delete_measurement(row.original.id).then(()=>{
        //                 // window.location.reload()
        //                 console.log("Deleted")
        //             })
        //         }} className="underline">Delete</div>
        //     }
        // }
        ]

    if (isError){
        <UserInfo>
            <p className="font-semibold mt-4">Error loading records</p>
        </UserInfo>
    }

    if (isLoading){
        return(
            <UserInfo>
                <p className="font-semibold mt-4">Loading your records</p>
            </UserInfo>
        )
    }



    return (
        <UserInfo>
            {
            data ? <Table data={data_to_render} columns={table_columns} entity_name="Your Records" searchMsg="Search your records"/>
            : <div className="font-semibold mt-4">You don't have any records yet</div>
            }
        </UserInfo>
    )

}