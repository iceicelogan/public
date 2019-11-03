#########################################
#                                       #
#         Solution to Euler 8           #
#           13 digit products           #
#                                       #
#########################################


number = "731671765313306249192251196744265747423553491949349698352031277450632623957831801698480186947885184385861" \
         "560789112949495459501737958331952853208805511125406987471585238630507156932909632952274430435576689664895" \
         "04452445231617318564030987111217223831136222989342338030813533627661428280644448664523874930358907296290" \
         "49156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678" \
         "81220235421809751254540594752243525849077116705560136048395864467063244157221553975369781797784617406495" \
         "51492908625693219784686224828397224137565705605749026140797296865241453510047482166370484403199890008895" \
         "243450658541227588666881164271714799244429282308634656748139191231628245861786645835912456652947654568284" \
         "891288314260769004224219022671055626321111109370544217506941658960408071984038509624554443629812309878799" \
         "272442849091888458015616609791913387549920052406368991256071760605886116467109405077541002256983155200055" \
         "93572972571636269561882670428252483600823257530420752963450"

maxprod = 0

for i in range(1, len(number)-13):

    pyprod = 1

    for j in range(i, i+13):

        pyprod *= int(number[j:j+1])

    if pyprod > maxprod:
        maxprod = pyprod

print(maxprod)