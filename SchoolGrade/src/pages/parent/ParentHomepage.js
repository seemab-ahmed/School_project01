import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../redux/userRelated/userHandle';
import styled from 'styled-components';
import CountUp from 'react-countup';
import Subject from "../../assets/subjects.svg";
import { getSubjectList } from '../../redux/sclassRelated/sclassHandle';

const ParentHomePage = () => {
    const dispatch = useDispatch();

    const { userDetails, currentUser } = useSelector((state) => state.user);
    const { subjectsList } = useSelector((state) => state.sclass);

    const [, setSubjectAttendance] = useState([]);

    const studentID = currentUser?.child?._id;

    useEffect(() => {
        if (studentID) {
            dispatch(getUserDetails(studentID, "Student"));
        }
    }, [dispatch, studentID]);

    useEffect(() => {
        if (userDetails?.sclassName?._id) {
            dispatch(getSubjectList(userDetails.sclassName._id, "ClassSubjects"));
        }
    }, [dispatch, userDetails]);

    useEffect(() => {
        if (userDetails) {
            setSubjectAttendance(userDetails.attendance || []);
        }
    }, [userDetails]);

    const numberOfSubjects = subjectsList?.length || 0;
   
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3} lg={3}>
                    <StyledPaper>
                        <img src={Subject} alt="Subjects" />
                        <Title>Total Subjects</Title>
                        <Data start={0} end={numberOfSubjects} duration={2.5} />
                    </StyledPaper>
                </Grid>
            </Grid>
        </Container>
    );
};


const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 200px;
  justify-content: space-between;
  align-items: center;
  text-align: center;
`;

const Title = styled.p`
  font-size: 1.25rem;
`;

const Data = styled(CountUp)`
  font-size: calc(1.3rem + .6vw);
  color: green;
`;

export default ParentHomePage;
