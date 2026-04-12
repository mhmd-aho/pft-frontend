import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ChartPieDonutText } from "./pie-chart";

export default function Savings() {
    return (
        <Card className="col-start-1 col-end-4 row-start-2 row-end-6">
                    <CardHeader>
                        <CardTitle className="text-3xl">Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartPieDonutText />
                    </CardContent>
        </Card>
    );
}