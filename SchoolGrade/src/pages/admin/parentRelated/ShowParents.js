import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { getAllParents } from '../../../redux/parentRelated/parentHandle';
import {
    Paper, Box, IconButton
} from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import {  BlueButton } from '../../../components/buttonStyles';
import TableTemplate from '../../../components/TableTemplate';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SpeedDialTemplate from '../../../components/SpeedDialTemplate';
import * as React from 'react';
import Popup from '../../../components/Popup';

const ShowParents = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(getAllParents());
    }, [, dispatch]);
    
    const { parentStudentsList, loading, error } = useSelector((state) => state.parent);
    console.log(parentStudentsList);
    if (error) {
        console.log(error);
    }
    
    const [showPopup, setShowPopup] = React.useState(false);
    const [message, setMessage] = React.useState("");

    const deleteHandler = (deleteID) => {
        setMessage("Sorry the delete function has been disabled for now.");
        setShowPopup(true);
    };

    const parentColumns = [
        { id: 'name', label: 'Name', minWidth: 170 },
        { id: 'email', label: 'Email', minWidth: 200 },
        { id: 'contact', label: 'Contact Number', minWidth: 150 },
    ];

    const parentRows = parentStudentsList && parentStudentsList?.length > 0 && parentStudentsList?.map((parent) => {
        return {
            name: parent.name,
            email: parent.email,
            contact: parent.contact,
            id: parent._id,
        };
    });

    const ParentButtonHaver = ({ row }) => {
        return (
            <>
                <IconButton onClick={() => deleteHandler(row.id)}>
                    <PersonRemoveIcon color="error" />
                </IconButton>
                <BlueButton variant="contained" onClick={() => navigate("/Admin/parents/parent/" + row.id)}>
                    View
                </BlueButton>
            </>
        );
    };

    const actions = [
        {
            icon: <PersonAddAlt1Icon color="primary" />, name: 'Add New Parent',
            action: () => navigate("/Admin/addparents")
        },
    ];

    return (
        <Box sx={{ padding: '30px' }}>
            {loading ?
                <div>Loading...</div>
                :
                <>
                    <Paper sx={{ width: '100%', overflow: 'hidden', padding: '30px' }}>
                        {Array.isArray(parentStudentsList) && parentStudentsList?.length > 0 &&
                            <TableTemplate buttonHaver={ParentButtonHaver} columns={parentColumns} rows={parentRows} />
                        }
                        <SpeedDialTemplate actions={actions} />
                    </Paper>
                </>
            }
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </Box>
    );
};

export default ShowParents;
