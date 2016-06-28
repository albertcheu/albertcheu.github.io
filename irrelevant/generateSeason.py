#!/usr/bin/python
import sys, json

if __name__ == "__main__":
    season = int(sys.argv[1])
    f = open("POI_s%d.tsv"%season,"r")
    lines = f.readlines()
    f.close()
    
    seasonData = []
    
    metadata = {}
    lineData = lines[0].strip().split('\t')
    numLines = int(lineData[1])
    metadata["numLines"] = numLines

    for i in (1,2,3):
        lineData = list(lines[i].strip().split('\t'))
        metadata[str(lineData[0])] = lineData[1:]
        pass
    #metadata["lineNames"] = 
    #metadata["lineColors"] = list(lines[2].strip().split(',')[1:])
    #metadata["boxColors"] = list(lines[3].strip().split(',')[1:])

    seasonData.append(metadata)

    #titles = list(lines[4].strip().split(',')[1:])
    numEpisodes = len(lines)-4#len(titles)

    for i in range(4,4+numEpisodes,1):
        episode = {}
        lineData = list(lines[i].strip().split('\t'))
        episode['events'] = lineData[1:numLines+1]
        episode['title'] = lineData[numLines+1]
        episode['desc'] = lineData[numLines+2]
        episode['numbers'] = lineData[numLines+3:]
        seasonData.append(episode)
        pass

    f = open("loadS%d.js"%season,"w")
    f.write("""
    function loadS%d(){
    loadSeason(%s,%d);
    }
    """ % (season,json.dumps(seasonData),season))
    f.close()

    pass
