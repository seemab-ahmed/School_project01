import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentMarks, downloadStudentResult } from '../../redux/parentRelated/parentHandle';
import {
    Container, Table, TableBody, TableHead, Typography, TextField, Button, Paper,
    BottomNavigation, BottomNavigationAction
} from '@mui/material';
import CustomBarChart from '../../components/CustomBarChart';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import TableChartIcon from '@mui/icons-material/TableChart';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { StyledTableCell, StyledTableRow } from '../../components/styles';

const ParentProgressReport = () => {
    const dispatch = useDispatch();
    const { studentMarks, loading, error } = useSelector((state) => state.parent);
    const [rollNumber, setRollNumber] = useState('');
    const [selectedSection, setSelectedSection] = useState('table');

    const handleSearch = () => {
        if (rollNumber.trim()) {
            dispatch(getStudentMarks(rollNumber));
            setRollNumber('');
        }
    };

    const handleDownloadResult = () => {
        if (studentMarks?._id) {
            dispatch(downloadStudentResult(studentMarks._id));
        }
    };

    const handleSectionChange = (_, newSection) => {
        setSelectedSection(newSection);
    };

    const renderTableSection = () => (
        <>
            {studentMarks && (
                <Typography variant="h6" align="center" gutterBottom>
                    Student Name: {studentMarks.name} | Roll Number: {studentMarks.rollNum}
                </Typography>
            )}
            <Typography variant="h5" align="center" gutterBottom>
                Report Card
            </Typography>
            <Table>
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Subject</StyledTableCell>
                        <StyledTableCell>Marks</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {studentMarks?.examResult?.map((result) => (
                        <StyledTableRow key={result._id}>
                            <StyledTableCell>{result.subName.subName}</StyledTableCell>
                            <StyledTableCell>{result.marksObtained}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

    const renderChartSection = () => (
        <CustomBarChart chartData={studentMarks?.examResult || []} dataKey="marksObtained" />
    );

    return (
        <Container sx={{ paddingBlock:'50px'}}>
            <Typography variant="h4" align="center" gutterBottom>
                Student Progress Report
            </Typography>
            <TextField
                label="Enter Student Roll Number"
                variant="outlined"
                fullWidth
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch} fullWidth>
                Search
            </Button>

            {loading ? (
                <Typography align="center" sx={{ mt: 2 }}>Loading...</Typography>
            ) : error ? (
                <Typography color="error" align="center" sx={{ mt: 2 }}>{error}</Typography>
            ) : studentMarks && studentMarks?.examResult?.length > 0 ? (
                <>
                    {selectedSection === 'table' && renderTableSection()}
                    {selectedSection === 'chart' && renderChartSection()}

                    <Button 
                        variant="contained" 
                        color="secondary" 
                        onClick={handleDownloadResult} 
                        sx={{ mt: 2 }} 
                        fullWidth
                    >
                        Download Result (PDF)
                    </Button>

                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation value={selectedSection} onChange={handleSectionChange} showLabels>
                            <BottomNavigationAction
                                label="Table"
                                value="table"
                                icon={selectedSection === 'table' ? <TableChartIcon /> : <TableChartOutlinedIcon />}
                            />
                            <BottomNavigationAction
                                label="Chart"
                                value="chart"
                                icon={selectedSection === 'chart' ? <InsertChartIcon /> : <InsertChartOutlinedIcon />}
                            />
                        </BottomNavigation>
                    </Paper>
                </>
            ) : null}
        </Container>
    );
};

export default ParentProgressReport;
