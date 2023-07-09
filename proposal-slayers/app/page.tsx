"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface Inputs {
	question1: string;
	question2: string;
	question3: string;
	question4: string;
	question5: string;
	question6: string;
	question7: string;
}

enum Stage {
	Question,
	Answer,
}

enum QuestionState {
	Question1,
	Question2,
	Question3,
	Question4,
	Question5,
	Question6,
	Question7,
}

export default function Home() {
	const [stage, setStage] = useState<Stage>(Stage.Question);
	const [inputs, setInputs] = useState<Inputs | null>(null);

	return (
		<main className="flex  min-h-screen flex-col items-center justify-between bg-red-300 text-black">
			{stage === Stage.Question && (
				<Question
					setInputs={setInputs}
					finishStage={() => setStage(Stage.Answer)}
				/>
			)}

			{stage === Stage.Answer && inputs && <Answer inputs={inputs} />}
		</main>
	);
}

function useFetchAnswer(inputs: Inputs) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		setLoading(true);

		// do request here
		axios
			.post("/api/answer", {} as any)
			.then((res) => setData(res.data))
			.catch((e) => setError(e))
			.finally(() => setLoading(false));
	}, []);

	return {
		loading,
		data,
		error,
	};
}

function Answer({ inputs }: { inputs: Inputs }) {
	const { data, error, loading } = useFetchAnswer(inputs);

	return <div>{loading && <div>Loading...</div>}</div>;
}

function Question({
	finishStage,
	setInputs,
}: {
	finishStage: () => void;
	setInputs: (inputs: Inputs) => void;
}) {
	const [state, setState] = useState<QuestionState>(QuestionState.Question1);
	const [buttonText, setButtonText] = useState<string>("Next");

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();

	useEffect(() => {
		if (state === QuestionState.Question7) {
			setButtonText("Submit");
		}
	}, [state]);

	const onSubmit: SubmitHandler<Inputs> = (data) => {
		if (state === QuestionState.Question7) {
			setInputs(data);
			return finishStage();
		}

		setState(state + 1);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex-col flex w-full flex-1 bg-yellow-300 items-center justify-center px-36"
		>
			{state === QuestionState.Question1 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 1</div>
					<input className="h-14 rounded-lg" {...register("question1")} />
				</div>
			)}

			{state === QuestionState.Question2 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 2</div>
					<input className="h-14 rounded-lg" {...register("question2")} />
				</div>
			)}

			{state === QuestionState.Question3 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 3</div>
					<input className="h-14 rounded-lg" {...register("question3")} />
				</div>
			)}

			{state === QuestionState.Question4 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 4</div>
					<input className="h-14 rounded-lg" {...register("question4")} />
				</div>
			)}

			{state === QuestionState.Question5 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 5</div>
					<input className="h-14 rounded-lg" {...register("question5")} />
				</div>
			)}

			{state === QuestionState.Question6 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 6</div>
					<input className="h-14 rounded-lg" {...register("question6")} />
				</div>
			)}

			{state === QuestionState.Question7 && (
				<div className="flex flex-col w-full">
					<div className="text-center">Question 7</div>
					<input className="h-14 rounded-lg" {...register("question7")} />
				</div>
			)}

			<input
				type="submit"
				value={buttonText}
				className="cursor-pointer h-12 w-full bg-red-500 rounded-lg mt-4 font-bold"
			/>
		</form>
	);
}
