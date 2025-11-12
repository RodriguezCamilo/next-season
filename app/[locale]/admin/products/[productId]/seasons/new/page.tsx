import SeasonForm, { upsertSeason } from "../season-form";

export default async function NewSeasonPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return (
    <div className=" flex flex-1 flex-col items-center">
      <h1 className="mb-4 text-xl font-semibold">New season</h1>
      <SeasonForm action={upsertSeason} productId={productId} />
    </div>
  );
}
