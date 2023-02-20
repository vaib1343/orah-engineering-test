import React, { useContext } from 'react'
import styled, { keyframes } from 'styled-components';
import { Images } from "assets/images"
import { StudentContext } from 'shared/context/student-context'
import { PersonHelper } from 'shared/models/person';

const theme: {
    [key: string]: {
        bgColor: string,
        color: string,
    }
} = {
    late: {
        color: '#d48806',
        bgColor: '#ffedd1'
    },
    present: {
        color: '#3f6600',
        bgColor: '#e3ffec'
    },
    absent: {
        color: '#7c7c7c',
        bgColor: '#e3e3e3'
    },
}

function ActivityRollTable() {
    const { studentStatusMapById, data } = useContext(StudentContext)
    return (
        <React.Fragment>
            <S.headContainer>
                <div>
                    <h1>Name</h1>
                </div>
                <div>
                    <h1>Status</h1>
                </div>
            </S.headContainer>
            {
                data?.students.map((student, index) => {
                    if (studentStatusMapById[student.id]) {
                        return <S.dataContainer key={student.id} index={index}>
                            <div>
                                <img src={Images.avatar} />
                                <h1>{PersonHelper.getFullName(student)}</h1>
                            </div>
                            <S.status bgColor={theme[studentStatusMapById[student.id]]?.bgColor} color={theme[studentStatusMapById[student.id]]?.color}>
                                {studentStatusMapById[student.id]}
                            </S.status>
                        </S.dataContainer>
                    }

                }
                )
            }
        </React.Fragment>
    )
}

interface StatusProps {
    bgColor: string,
    color: string
}

const slideUp = keyframes`
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: none;
        opacity: 1;
    }
`

const S = {
    dataContainer: styled.div<{index: number}>`
        width: 100%;
        display: grid;
        justify-content: space-around;
        align-items: center;
        grid-template-columns: 70% 30%;
        border-radius: 1rem;
        background-color: #e7e7e7;
        padding: 1rem;
        margin-block: .7rem;
        cursor: pointer;
        animation-name: ${slideUp};
        animation-duration: 700ms;
        animation-fill-mode: both;
        animation-delay: ${props => props.index * 100}ms;

        &:hover {
            background-color: #ededed;
        }

        h1 {
            font-size: 1rem;
            margin: 0;
        }

        img {
            height: 50px;
            width: 50px;
            border-radius: 50%;
        }
    `,
    headContainer: styled.div`
        width: 100%;
        display: grid;
        justify-content: space-around;
        align-items: center;
        grid-template-columns: 70% 30%;
        padding: 0rem 1rem;
        h1 {
            margin: 0px !important;
            font-size: 1.2rem;
        }
    `,
    status: styled.div<StatusProps>`
        text-align: center;
        width: fit-content;
        min-width: 4rem;
        text-transform: capitalize;
        font-size: .8rem;
        border-radius: 0.4rem;
        border: 1px solid ${props => props.color};
        color: ${props => props.color};
        background-color: ${props => props.bgColor};
        padding: .3rem .5rem;

    `
}

export default ActivityRollTable

