
-- Function to increment the current_travelers count for a trip
CREATE OR REPLACE FUNCTION increment_trip_travelers(trip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.trips
  SET current_travelers = current_travelers + 1
  WHERE id = trip_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement the current_travelers count for a trip
CREATE OR REPLACE FUNCTION decrement_trip_travelers(trip_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.trips
  SET current_travelers = GREATEST(current_travelers - 1, 1)
  WHERE id = trip_id;
END;
$$ LANGUAGE plpgsql;
