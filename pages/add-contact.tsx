import { NextPage } from "next";
import AddCotact from "../components/AddContact";

const AddContactPage: NextPage<{loginUser: {name: string, email: string, image: string, phone: string, _id: string}}> = (props) => {


    return <div>
        <AddCotact></AddCotact>
    </div>
}

export default AddContactPage;