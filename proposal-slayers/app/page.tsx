"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChakraProvider } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";

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
		<ChakraProvider>
			<main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
				{stage === Stage.Question && (
					<Question
						setInputs={setInputs}
						finishStage={() => setStage(Stage.Answer)}
					/>
				)}

				{stage === Stage.Answer && inputs && <Answer inputs={inputs} />}
			</main>
		</ChakraProvider>
	);
}

function useFetchAnswer(inputs: Inputs) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<any>(null);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		// setLoading(true);
		// do request here
		// axios
		// 	.post("/api/answer", {} as any)
		// 	.then((res) => setData(res.data))
		// 	.catch((e) => setError(e))
		// 	.finally(() => setLoading(false));
	}, []);

	return {
		loading,
		data,
		error,
	};
}

function Answer({ inputs }: { inputs: Inputs }) {
	const { data, error, loading } = useFetchAnswer(inputs);

	return (
		<div className="flex-col flex w-full flex-1 items-center justify-center">
			{!loading && <Spinner size="xl" />}
		</div>
	);
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

	const { register, handleSubmit } = useForm<Inputs>();

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
			className="flex-col flex w-full flex-1 items-center justify-center px-96 text-gray-700"
		>
			{state === QuestionState.Question1 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 1</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question1")}
					/>
				</div>
			)}

			{state === QuestionState.Question2 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 2</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question2")}
					/>
				</div>
			)}

			{state === QuestionState.Question3 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 3</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question3")}
					/>
				</div>
			)}

			{state === QuestionState.Question4 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 4</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question4")}
					/>
				</div>
			)}

			{state === QuestionState.Question5 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 5</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question5")}
					/>
				</div>
			)}

			{state === QuestionState.Question6 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 6</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question6")}
					/>
				</div>
			)}

			{state === QuestionState.Question7 && (
				<div className="flex flex-col w-full gap-7">
					<div className="text-center">Question 7</div>
					<input
						className="h-14 rounded-lg p-5 border border-gray-200"
						{...register("question7")}
					/>
				</div>
			)}

			<input
				type="submit"
				value={buttonText}
				className="cursor-pointer h-12 w-full rounded-lg mt-4 font-bold bg-white text-pink-400 outline outline-[2px] outline-pink-400 hover:outline-none hover:bg-pink-400 hover:text-white transition-colors duration-300"
			/>
		</form>
	);
}
