import React, { useContext } from "react"
import styled, { keyframes } from "styled-components"
import { Spacing } from "shared/styles/styles"
import folder from "assets/images/icons-folder.svg"
import { Colors } from "shared/styles/colors"
import { useNavigate } from "react-router-dom"
import { StudentContext } from "shared/context/student-context"
import ActivityRollTable from "staff-app/components/activity-roll-table/activity-roll-table"

export const ActivityPage: React.FC = () => {
  const navigate = useNavigate()
  const { studentStatusMapById } = useContext(StudentContext);

  return <S.Container>

    {
      !Object.keys(studentStatusMapById).length ?
        <S.NotFound>
          <img src={folder} />
          <button onClick={() => navigate('/staff/daily-care')}>
            Update Status
          </button>
        </S.NotFound>
        : <ActivityRollTable />
    }
  </S.Container>
}

const slideUp = keyframes`
0% {
  opacity: 0;
  transform: translateY(100%);
}

50% {
  opacity: .5;
}

100% {
  transform: none;
  opacity: 1;
}

`

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
  NotFound: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    animation-name: ${slideUp};
    animation-duration: 1s;
    animation-delay: 100ms;
    animation-fill-mode: both;
    transition: ease-in;
    img {
      height: 7rem;
      width: 7rem;
    }
    button {
      font-size: 1.1rem;
      padding: .5rem 1rem;
      border: 0px;
      outline: 0px;
      border-radius: .5rem;
      background-color: ${Colors.blue.base};
      color: white;
      cursor: pointer;
    }

  `
}
