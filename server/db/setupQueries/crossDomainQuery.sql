//   `select Max(sport_event.id),
  //       Max(home_team_id_fkey) as home_team_id,
  //       Max(travel_team_id_fkey) as travel_team_id,
  //       Max(dt_tm),
  //       Max(league_id_fkey) as league_id,
  //       Max(sport_event.city_id_fkey) as city_id,
  //       Max(travel_team.name) as travel_team_name,
  //       Max(home_team.name) as home_team_name,
  //       Max(city.name) as city_name,
  //       json_agg(json_build_object('id', betting_line.id, 
  //                 'bet_type', betting_line.bet_type,
  //                 'game_total', betting_line.game_total,
  //                 'spread', betting_line.spread,
  //                 'favorite_odds', betting_line.favorite_odds,
  //                 'underdog_odds', betting_line.underdog_odds,
  //                 'over_odds', betting_line.over_odds,
  //                 'under_odds', betting_line.under_odds
  //               )) as betting_lines
  //   from sport_event
  //   inner join team as home_team
  //   on sport_event.home_team_id_fkey=home_team.id
  //   inner join team as travel_team
  //   on sport_event.travel_team_id_fkey=travel_team.id
  //   inner join city
  //   on sport_event.city_id_fkey=city.id
  //   inner join betting_line
  //   on betting_line.sport_event_id_fkey=sport_event.id
  //   where league_id_fkey=$1
  //   group by sport_event.id;`;