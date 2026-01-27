import { Main } from "@/components/main";
import { config, getSections } from "@/lib/get-sections";

export default function Page() {
	const sections = getSections();
	return <Main sections={sections} config={config} />;
}
