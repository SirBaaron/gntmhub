import {Question} from '@prisma/client'
import type {NextPage} from 'next'
import {Site} from '../../components/Site';
import {QuestionSubmission} from '../../components/QuestionSubmission';
import {Question as QuestionComponent} from '../../components/Question';
import {useQuestionStore, useRequireLogin} from '../../util/client';

const Home: NextPage = () => {
    useRequireLogin();
    const [questions, setAnswer] = useQuestionStore(store => [store.questions, store.setMyAnswer, store.load()])

    return <Site>
        <div>
            {questions.map(question => <QuestionComponent key={question.id} question={question} setAnswer={(answerId) => setAnswer(question.id, answerId)}/>)}
        </div>
        <QuestionSubmission/>
    </Site>
}

export default Home
