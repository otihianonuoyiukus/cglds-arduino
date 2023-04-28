export interface UnitData {
  id?: string;
  name?: string;
  sensorValue?: number;
  dateTime?: string;
  loading?: boolean;
  onOpenValve?: (id: string) => void;
}
